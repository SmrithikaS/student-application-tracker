package main

import (
	"database/sql"
	"log"
	"net/http"

	// "time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	_ "github.com/go-sql-driver/mysql"
)

type Item struct {
	ID            int    `json:"id"`
	Name          string `json:"name"`
	Status        string `json:"status"`
	InterviewDate *string `json:"interview,omitempty"`
	Result        string `json:"result,omitempty"`
}

var db *sql.DB

func InitDB() {
	var err error
	db, err = sql.Open("mysql", "myapplication:mypassword@tcp(127.0.0.1:3316)/applicationdb")
	if err != nil {
		log.Fatalf("Failed to connect to the database: %v", err)
	}

	err = db.Ping()
	if err != nil {
		log.Fatalf("Failed to ping the database: %v", err)
	}
	log.Println("Database connected successfully")
}

func main() {
	InitDB()

	router := gin.Default()
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"}, // Allow frontend
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders:     []string{"Content-Type"},
		AllowCredentials: true,
	}))

	router.GET("/application", func(c *gin.Context) {
		if db == nil {
			log.Fatal("Database connection is not initialized!")
		}

		rows, err := db.Query("SELECT id, name, status, interview, result FROM application")
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

			// Correctly scan values into separate variables
			if err := rows.Scan(&item.ID, &item.Name, &item.Status, &interviewDate, &result); err != nil {
				log.Printf("Error scanning row: %v", err)
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}

			// Convert sql.NullTime to *time.Time
			if interviewDate.Valid {
				item.InterviewDate = &interviewDate.String
			} else {
				item.InterviewDate = nil
			}

			// Convert sql.NullString to string (empty if null)
			if result.Valid {
				item.Result = result.String
			} else {
				item.Result = ""
			}

			applications = append(applications, item)
		}
		c.JSON(http.StatusOK, applications)
	})

	router.Run(":8080")
}
