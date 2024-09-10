
# WeatherWave

**WeatherWave** is a Django-based web application that combines a user authentication system with real-time weather information from the OpenWeatherMap API. The project includes both a backend API and a frontend React application, providing a complete solution for user management and weather forecasting.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Frontend Features](#frontend-features)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## Features

- **User Authentication**: Register, login, logout, and manage user profiles.
- **Weather Information**: Retrieve weather data for any location using the OpenWeatherMap API.
- **CRUD Operations**: Users can manage their profiles with update and delete operations.
- **Token-based Authentication**: Secure API endpoints using token-based authentication for user access.
- **Real-Time Weather Data**: Weather forecast for today, tomorrow, and the day after for a user-selected location.
- **Frontend Integration**: Interactive and responsive UI built with React, including real-time weather updates and user profile management.

## Technologies Used

- **Backend**: Django 2.1, Django REST Framework
- **Frontend**: React, Bootstrap
- **Database**: PostgreSQL
- **APIs**: OpenWeatherMap API
- **Authentication**: Token-based authentication using `rest_framework.authtoken`
- **Additional Packages**:
  - `django-easyaudit` for auditing user activities
  - `corsheaders` for handling cross-origin requests


## Project Structure

```
WeatherWave/
├── user/
│   ├── admin.py
│   ├── apps.py
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   ├── urls.py
│   ├── tests.py
├── Weather/
│   ├── apps.py
│   ├── models.py
│   ├── views.py
│   ├── urls.py
│   ├── tests.py
├── WeatherWave/
│   ├── settings.py
│   ├── urls.py
│   ├── wsgi.py
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── weatherwave/
│   │   │   │   ├── WeatherDashboard.js
│   │   │   ├── user/
│   │   │   │   └── UserLogin.js
│   │   │   │   └── UserLogout.js
│   │   │   │   └── UserProfile.js
│   │   │   │   └── UserDelete.js
│   │   │   │   └── UserRegister.js
│   │   │   ├── Dashboard.js
│   │   │   ├── Navbar.js
│   │   ├── App.js
│   │   ├── index.js
│   ├── public/
│   ├── package.json
├── .env
├── manage.py
├── venv/
├── requirements.txt
├── README.md
```

## Installation

### Prerequisites

- Python 3.x
- Django 2.1.x
- PostgreSQL
- OpenWeatherMap API key
- Node.js and npm for frontend

### Backend Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/esorsubedi5/WeatherWave.git
   cd WeatherWave
   ```

2. Create a virtual environment and activate it:

   ```bash
   python3 -m venv env
   source env/bin/activate  # On Windows use `env\Scripts\activate`
   ```

3. Install the dependencies:

   ```bash
   pip install -r requirements.txt
   ```

4. Set up the PostgreSQL database and update the `.env` file with your database credentials.

5. Run the migrations:

   ```bash
   python manage.py migrate
   ```

6. Create a superuser to access the admin panel:

   ```bash
   python manage.py createsuperuser
   ```

7. Run the Django development server:

   ```bash
   python manage.py runserver
   ```

### Frontend Setup

1. Navigate to the `frontend` directory:

   ```bash
   cd frontend
   ```

2. Install the frontend dependencies:

   ```bash
   npm install
   ```

3. Start the React development server:

   ```bash
   npm start
   ```

## Environment Variables

The project uses a `.env` file to store sensitive information. Ensure you have the following variables in your `.env` file:

```bash
DEBUG=True
SECRET_KEY=your_secret_key
ALLOWED_HOSTS=localhost, 127.0.0.1
DB_ENGINE=django.db.backends.postgresql
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=5432
API_KEY=your_openweathermap_api_key
```

## Usage

Once both the backend and frontend servers are running, you can:

- Access the user authentication features by navigating to `/account/`
- Fetch weather data by accessing `/api/weather/`
- View the admin panel by going to `/admin/`
- Interact with the React frontend for profile management and weather information

### User Authentication Features

1. **Register**:
   - **Endpoint**: `/account/register/`
   - **Method**: `POST`
   - **Description**: Allows new users to create an account by providing a username, email, and password.

2. **Login**:
   - **Endpoint**: `/account/`
   - **Method**: `POST`
   - **Description**: Authenticates users and provides a token for accessing protected endpoints.

3. **Logout**:
   - **Endpoint**: `/account/logout/`
   - **Method**: `POST`
   - **Description**: Logs out the current user and invalidates their token.

4. **View Profile**:
   - **Endpoint**: `/account/me/`
   - **Method**: `GET`
   - **Description**: Retrieves the current user's profile details.

5. **Delete Account**:
   - **Endpoint**: `/account/delete/`
   - **Method**: `DELETE`
   - **Description**: Permanently deletes the user's account.

### Weather Endpoints:

1. **Get Weather**:
   - **Endpoint**: `/api/weather/`
   - **Method**: `GET`
   - **Description**: Retrieves weather information for a specified location.

### Frontend Features:

1. **Dashboard**: 
   - Displays the current weather and a 3-day forecast for the selected city.
   - Allows users to input a city name and view updated weather information.
   - Includes a button to navigate to a detailed weather forecast page.

2. **User Profile**:
   - Allows users to view and edit their profile information.
   - Users can update their username, email, mobile number, first name, and last name.
   - Users can delete their account.

3. **Navbar**:
   - Contains navigation links for login, signup, profile, and logout.
   - Displays different options based on the user's login status.

## API Endpoints

| Method | Endpoint           | Description                                 |
|--------|--------------------|---------------------------------------------|
| POST   | `/account/register/` | Register a new user                        |
| POST   | `/account/`          | Login with username or email and password  |
| GET    | `/account/me/`       | Retrieve the current user's details        |
| POST   | `/account/logout/`   | Logout the current user                    |
| DELETE | `/account/delete/`   | Delete the current user                    |
| GET    | `/api/weather/`      | Get weather information                    |

## Testing

You can run the Django tests using:

```bash
python manage.py test
```

## Contributing

1. Fork the repository
2. Create a new feature branch (`git checkout -b feature-branch`)
3. Commit your changes (`git commit -m 'Add a new feature'`)
4. Push to the branch (`git push origin feature-branch`)
5. Create a Pull Request

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
