package main

import (
	"context"
	"database/sql"
	"log"
	"net/http"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	_ "github.com/go-sql-driver/mysql"
	"github.com/sashabaranov/go-openai"
	"golang.org/x/crypto/bcrypt"
	"github.com/joho/godotenv"
)

type Item struct {
	ID            int    `json:"id"`
	Name          string `json:"name"`
	Status        string `json:"status"`
	InterviewDate *string `json:"interview,omitempty"`
	Result        string `json:"result,omitempty"`
}
type User struct {
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

var db *sql.DB
var openAIKey string

func InitDB() {
	
	err := godotenv.Load()
    if err != nil {
        log.Println("Warning: No .env file found")
    }
	dbUser := os.Getenv("MYSQL_USER")
	dbPassword := os.Getenv("MYSQL_PASSWORD")
	dbName := os.Getenv("MYSQL_DATABASE")
	dbHost := "mysql-db" 
	dbPort := "3306" 
	openAIKey = os.Getenv("OPENAI_API_KEY")

	dsn := dbUser + ":" + dbPassword + "@tcp(" + dbHost + ":" + dbPort + ")/" + dbName
	db, err = sql.Open("mysql",dsn)
	if err != nil {
		log.Fatalf("Failed to connect to the database: %v", err)
	}

	err = db.Ping()
	if err != nil {
		log.Fatalf("Failed to ping the database: %v", err)
	}
	log.Println("Database connected successfully")
}

func loginUser(c *gin.Context) {
	var credentials struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := c.ShouldBindJSON(&credentials); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}

	var storedPassword string
	err := db.QueryRow("SELECT password FROM users WHERE email = ?", credentials.Email).Scan(&storedPassword)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(storedPassword), []byte(credentials.Password))
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Login successful"})
}

func registerUser(c *gin.Context) {
	var user struct {
		Username string `json:"username"`
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	_, err = db.Exec("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", user.Username, user.Email, string(hashedPassword))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to store user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User registered successfully"})
}

func getFAQAnswer(db *sql.DB, question string) (string, error) {
	log.Println("Running SQL for question:", question)
	var answer string
	log.Printf("getFAQAnswer() received question: %q\n", question)
	err := db.QueryRow("SELECT answer FROM chatbot WHERE MATCH(question) AGAINST (? IN NATURAL LANGUAGE MODE)", question).Scan(&answer)
	if err != nil {
		log.Println("No answer found in DB for:", question, "Error:", err)
		return "", err
	}
	log.Println("Match found in DB. Answer:", answer)
	return answer, nil
}



func chatHandler(c *gin.Context) {
	var req struct {
		Message string `json:"message"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		log.Println("Invalid request body:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	log.Println("Received message:", req.Message)

	faqAnswer, err := getFAQAnswer(db, req.Message)
	if err == nil && faqAnswer != "" {
		log.Println("Answer found in DB:", faqAnswer)
		c.JSON(http.StatusOK, gin.H{"reply": faqAnswer})
		return
	}

	client := openai.NewClient(openAIKey)
	resp, err := client.CreateChatCompletion(
		context.Background(),
		openai.ChatCompletionRequest{
			Model: openai.GPT4Turbo,
			Messages: []openai.ChatCompletionMessage{
				{Role: "user", Content: req.Message},
			},
		},
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ChatGPT request failed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"reply": resp.Choices[0].Message.Content})
}


func main() {
	InitDB()

	router := gin.Default()
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://18.211.153.46"}, 
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders:     []string{"Content-Type"},
		AllowCredentials: true,
	}))
	router.GET("/application", func(c *gin.Context) {
		userEmail := c.Query("email") 
		log.Println("Received request for applications of email:", userEmail) 

    if db == nil {
        log.Fatal("Database connection is not initialized!")
    }

    var userID int
    err := db.QueryRow("SELECT id FROM users WHERE email=?", userEmail).Scan(&userID)
    if err != nil {
        log.Printf("User not found for email %s: %v", userEmail, err)
        c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
        return
    }
		log.Println("User ID for email:", userID) 

    rows, err := db.Query("SELECT id, name, status, interview, result FROM application WHERE user_id=?", userID)
    if err != nil {
        log.Printf("Database query failed: %v", err)
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    defer rows.Close()

    var applications []Item
    for rows.Next() {
        var item Item
        var interviewDate sql.NullString
        var result sql.NullString

        if err := rows.Scan(&item.ID, &item.Name, &item.Status, &interviewDate, &result); err != nil {
            log.Printf("Error scanning row: %v", err)
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
            return
        }

        if interviewDate.Valid {
            item.InterviewDate = &interviewDate.String
        } else {
            item.InterviewDate = nil
        }

        if result.Valid {
            item.Result = result.String
        } else {
            item.Result = ""
        }

        applications = append(applications, item)
    }

		log.Println("Returning applications:", applications) 
    c.JSON(http.StatusOK, applications)
})


	router.POST("/api/chat", chatHandler)
	router.POST("/api/login", loginUser)
	router.POST("/api/register", registerUser)

	router.Run(":8080")
}