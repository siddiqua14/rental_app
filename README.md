
# Booking-Rental-App Project with Beego Framework

The Booking App fetches and stores hotel and rental property data from the Booking.com API into a local PostgreSQL database. It implements a backend API using the Beego framework to serve property data and provides a frontend for displaying property listings and details.
## Frontend Project (rental)
### Goals
The frontend is designed to show property listings for a location and property details. The goal is to display properties dynamically using AJAX, with a focus on the Property Listing and Property Details pages.

## Prerequisites
Before you begin, ensure you have met the following requirements:

- **Go (Golang)**: Version 1.18 or higher.
- **Beego Framework**: Installed globally.
- **Git**: For cloning the repository.

## Installation and Setup

### Step 1: Clone the repository
To get started, clone the project repository:
1. Navigate to your Go src `/go/src` directory to ensure the project is placed in the correct directory for your Go workspace.
2. Clone the repository:
```bash
git clone https://github.com/siddiqua14/rental_app.git
cd rental_app
```


### Step 3: Install Beego Framework
Beego is the framework used for this project, and Bee CLI is a development tool. If `Beego` is not installed in your workspace,
- Install them by running:
```bash
go get github.com/beego/beego/v2@latest
```
Ensure your `GOPATH` is set up correctly:
##### To verify installation:
```bash
bee version
```

### Step 5: Install Dependencies

After installing the required Go modules and Beego dependencies:

```bash
go mod tidy
```
This will automatically resolve any missing dependencies and update your go.sum file with the required entries.
Run the application:
```bash
bee run 
```
Access the application at `http://localhost:3000`.


## Frontend Project (rental_app)
### Property Listing Page:
- The page will use the backend API endpoint /v1/property/list to fetch all the data for the property list.
- Dynamic Data Fetching: The properties will be fetched from the backend API, ensuring that the page is populated with the most up-to-date property data.
### Property Details Page: 
- The page will use the backend API endpoint /v1/property/details to fetch the data for a particular property.
- The backend API will be used to retrieve and display the relevant data for the selected property.

 #### Note: 
 The backend API will be used to retrieve and display the relevant data for the selected property.
