package database

import (
	"context"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var DB *mongo.Database

func ConnectDatabase() {
	// MongoDB connection string
	dbURL := "mongodb+srv://ysoni:ysoni1802@cluster0.hvqyf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

	// Create a context with timeout
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	// Connect to MongoDB
	client, err := mongo.Connect(ctx, options.Client().ApplyURI(dbURL))
	if err != nil {
		log.Fatal("Failed to connect to MongoDB!", err)
	}

	// Ping the database to verify connection
	err = client.Ping(ctx, nil)
	if err != nil {
		log.Fatal("Failed to ping MongoDB!", err)
	}

	// Get database instance
	DB = client.Database("yashbackend")

	log.Println("Connected to MongoDB successfully!")
}
