import math
from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
import mysql.connector
import bcrypt
import jwt
from datetime import datetime, timedelta


# JWT SETTINGS
SECRET_KEY = "change_this_to_a_long_random_secret_key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60


# Authentication token
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


# Get current logged-in user
def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        user_id = payload.get("user_id")

        if user_id is None:
            raise HTTPException(
                status_code=401,
                detail="Invalid authentication token"
            )

        return {
            "user_id": user_id
        }

    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=401,
            detail="Token has expired"
        )

    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=401,
            detail="Invalid authentication token"
        )


# Create FastAPI application
app = FastAPI()


# Database connection
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="Harsha@321",
    database="agrirent",
    autocommit=True
)


# Home API
@app.get("/")
def home():
    return {
        "message": "Welcome to AgriRent API 🚜"
    }


@app.get("/users")
def get_users():
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT user_id, name, role
        FROM users
    """)

    users = cursor.fetchall()

    cursor.close()

    return users


@app.put("/users/location")
def update_user_location(
    latitude: float,
    longitude: float,
    current_user: dict = Depends(get_current_user)
):
    cursor = db.cursor(dictionary=True)

    cursor.execute(
        """
        SELECT role
        FROM users
        WHERE user_id = %s
        """,
        (current_user["user_id"],)
    )

    user = cursor.fetchone()

    if not user:
        cursor.close()
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    if user["role"] != "owner":
        cursor.close()
        raise HTTPException(
            status_code=403,
            detail="Only equipment owners can update this location"
        )

    cursor.execute(
        """
        UPDATE users
        SET latitude = %s, longitude = %s
        WHERE user_id = %s
        """,
        (
            latitude,
            longitude,
            current_user["user_id"]
        )
    )

    cursor.close()

    return {
        "message": "Owner location updated successfully"
    }

@app.get("/equipment")
def get_equipment():

    db = mysql.connector.connect(
        host="localhost",
        user="root",
        password="Harsha@321",
        database="agrirent"
    )

    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT
            equipment_id,
            owner_id,
            name,
            category,
            brand,
            model,
            price_per_hour,
            price_per_day,
            availability
        FROM equipment
    """)

    equipment = cursor.fetchall()

    cursor.close()
    db.close()

    return equipment

@app.get("/owner-equipment/{owner_id}")
def get_owner_equipment(owner_id: int):
    db.ping(reconnect=True, attempts=3, delay=1)

    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT
            equipment_id,
            owner_id,
            name,
            category,
            brand,
            model,
            price_per_hour,
            price_per_day,
            availability
        FROM equipment
       WHERE e.owner_id = %s
ORDER BY b.booking_id DESC
    """, (owner_id,))

    equipment = cursor.fetchall()

    cursor.close()

    return equipment

@app.get("/reviews")
def get_reviews():
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT
            review_id,
            booking_id,
            rating,
            comment
        FROM reviews
    """)

    reviews = cursor.fetchall()

    cursor.close()

    return reviews
@app.get("/notifications")
def get_notifications():
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT
            notification_id,
            user_id,
            title,
            message,
            is_read,
            created_at
        FROM notifications
    """)

    notifications = cursor.fetchall()

    cursor.close()

    return notifications
from pydantic import BaseModel

class User(BaseModel):
    name: str
    role: str


@app.post("/users")
def add_user(user: User):
    cursor = db.cursor()

    cursor.execute(
        "INSERT INTO users (name, role) VALUES (%s, %s)",
        (user.name, user.role)
    )

    db.commit()

    user_id = cursor.lastrowid

    cursor.close()

    return {
        "message": "User added successfully",
        "user_id": user_id
    }

class Equipment(BaseModel):
    name: str
    category: str
    price_per_day: float
    owner_id: int
    latitude: float
    longitude: float


@app.post("/equipment")
def add_equipment(
    equipment: Equipment,
    current_user: dict = Depends(get_current_user)
):
    cursor = db.cursor()

    cursor.execute(
        """
        INSERT INTO equipment
        (name, category, price_per_day, owner_id, latitude, longitude)
        VALUES (%s, %s, %s, %s, %s, %s)
        """,
        (
            
           equipment.name,
           equipment.category,
           equipment.price_per_day,
           equipment.owner_id,
           equipment.latitude,
           equipment.longitude

        )
    )

    db.commit()

    equipment_id = cursor.lastrowid

    cursor.close()

    return {
        "message": "Equipment added successfully",
        "equipment_id": equipment_id
    }
class Booking(BaseModel):
    farmer_id: int
    equipment_id: int
    start_date: str
    end_date: str
    total_amount:float

class BookingStatus(BaseModel):
    status: str

class NearbyOwnerRequest(BaseModel):
    farmer_id: int
    latitude: float
    longitude: float
    radius_km: float = 10.0


@app.post("/bookings")
def add_booking(booking: Booking):
    cursor = db.cursor(dictionary=True)

    # Find the equipment owner
    cursor.execute(
        """
        SELECT owner_id, name
        FROM equipment
        WHERE equipment_id = %s
        """,
        (booking.equipment_id,)
    )

    equipment = cursor.fetchone()

    if not equipment:
        cursor.close()
        return {
            "message": "Equipment not found"
        }

    owner_id = equipment["owner_id"]
    equipment_name = equipment["name"]

    # Create booking
    cursor.execute(
        """
        INSERT INTO bookings
        (farmer_id, equipment_id, start_date, end_date, total_amount, status)
        VALUES (%s, %s, %s, %s, %s, %s)
        """,
        (
            booking.farmer_id,
            booking.equipment_id,
            booking.start_date,
            booking.end_date,
            booking.total_amount,
            "Pending"
        )
    )

    booking_id = cursor.lastrowid

    # Create notification for equipment owner
    cursor.execute(
        """
        INSERT INTO notifications
        (user_id, title, message, is_read)
        VALUES (%s, %s, %s, %s)
        """,
        (
            owner_id,
            "New Booking Request",
            f"New booking request for {equipment_name}. Booking ID: {booking_id}",
            0
        )
    )

    db.commit()
    cursor.close()

    return {
        "message": "Booking created successfully",
        "booking_id": booking_id,
        "status": "Pending"
    }


@app.put("/bookings/{booking_id}")
def update_booking_status(booking_id: int, data: BookingStatus):
    cursor = db.cursor()

    cursor.execute(
        "UPDATE bookings SET status = %s WHERE booking_id = %s",
        (data.status, booking_id)
    )

    db.commit()

    cursor.execute(
        """
        SELECT farmer_id
        FROM bookings
        WHERE booking_id = %s
        """,
        (booking_id,)
    )

    booking = cursor.fetchone()

    if booking:
        farmer_id = booking[0]

        cursor.execute(
            """
            INSERT INTO notifications (user_id, title, message)
            VALUES (%s, %s, %s)
            """,
            (
                farmer_id,
                "Booking Update",
                f"Your booking #{booking_id} has been {data.status}."
            )
        )

        db.commit()

    cursor.close()

    return {
        "message": "Booking status updated successfully",
        "booking_id": booking_id,
        "status": data.status
    }
@app.get("/bookings")
def get_bookings():
    db = mysql.connector.connect(
        host="localhost",
        user="root",
        password="Harsha@321",
        database="agrirent"
    )

    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT
            booking_id,
            farmer_id,
            equipment_id,
            start_date,
            end_date,
            total_amount,
            status
        FROM bookings
    """)

    bookings = cursor.fetchall()

    cursor.close()
    db.close()

    return bookings
@app.get("/owner-bookings/{owner_id}")
def get_owner_bookings(owner_id: int):

    db = mysql.connector.connect(
        host="localhost",
        user="root",
        password="Harsha@321",
        database="agrirent"
    )

    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT
            b.booking_id,
            b.farmer_id,
            b.equipment_id,
            e.name AS equipment_name,
            e.category,
            b.start_date,
            b.end_date,
            b.total_amount,
            b.status
        FROM bookings b
        JOIN equipment e
            ON b.equipment_id = e.equipment_id
        WHERE e.owner_id = %s
        ORDER BY b.booking_id DESC
    """, (owner_id,))

    bookings = cursor.fetchall()

    cursor.close()
    db.close()

    return bookings

@app.get("/bookings/{booking_id}")
def get_booking_by_id(booking_id: int):
    cursor = db.cursor(dictionary=True)

    cursor.execute(
        "SELECT * FROM bookings WHERE booking_id = %s",
        (booking_id,)
    )

    booking = cursor.fetchone()

    cursor.close()

    if booking is None:
        return {
            "message": "Booking not found"
        }

    return booking
@app.delete("/bookings/{booking_id}")
def delete_booking(booking_id: int):
    cursor = db.cursor()

    cursor.execute(
        "DELETE FROM bookings WHERE booking_id = %s",
        (booking_id,)
    )

    db.commit()

    cursor.close()

    return {
        "message": "Booking deleted successfully",
        "booking_id": booking_id
    }
@app.get("/equipment/{equipment_id}")
def get_equipment_by_id(equipment_id: int):
    cursor = db.cursor(dictionary=True)

    cursor.execute(
        "SELECT * FROM equipment WHERE equipment_id = %s",
        (equipment_id,)
    )

    equipment = cursor.fetchone()

    cursor.close()

    if equipment is None:
        return {
            "message": "Equipment not found"
        }

    return equipment
class UserRegister(BaseModel):
    name: str
    phone: str
    email: str
    password: str
    role: str
    village: str = None
    district: str = None
    state: str = None
    latitude: float = None
    longitude: float = None

@app.put("/equipment/{equipment_id}")
def update_equipment(
    equipment_id: int,
    name: str,
    category: str,
    price_per_day: float
):
    db.ping(reconnect=True, attempts=3, delay=1)

    cursor = db.cursor()

    cursor.execute("""
        UPDATE equipment
        SET
            name = %s,
            category = %s,
            price_per_day = %s
        WHERE equipment_id = %s
    """, (
        name,
        category,
        price_per_day,
        equipment_id
    ))

    db.commit()

    cursor.close()

    return {
        "message": "Equipment updated successfully"
    }

@app.put("/equipment/{equipment_id}/availability")
def update_equipment_availability(
    equipment_id: int,
    availability: int
):
    db.ping(reconnect=True, attempts=3, delay=1)

    cursor = db.cursor()

    cursor.execute("""
        UPDATE equipment
        SET availability = %s
        WHERE equipment_id = %s
    """, (
        availability,
        equipment_id
    ))

    db.commit()

    cursor.close()

    return {
        "message": "Equipment availability updated successfully"
    }

@app.delete("/equipment/{equipment_id}")
def delete_equipment(equipment_id: int):
    db.ping(reconnect=True, attempts=3, delay=1)

    cursor = db.cursor()

    cursor.execute(
        "SELECT COUNT(*) FROM bookings WHERE equipment_id = %s",
        (equipment_id,)
    )

    booking_count = cursor.fetchone()[0]

    if booking_count > 0:
        cursor.close()

        return {
            "message": "Cannot delete equipment because it has existing bookings."
        }

    cursor.execute(
        "DELETE FROM equipment WHERE equipment_id = %s",
        (equipment_id,)
    )

    db.commit()

    cursor.close()

    return {
        "message": "Equipment deleted successfully"
    }


@app.post("/register")
def register_user(user: UserRegister):

    db = mysql.connector.connect(
        host="localhost",
        user="root",
        password="Harsha@321",
        database="agrirent"
    )

    cursor = db.cursor()

    password_hash = bcrypt.hashpw(
        user.password.encode("utf-8"),
        bcrypt.gensalt()
    ).decode("utf-8")

    cursor.execute(
        """
        INSERT INTO users
        (name, phone, email, password_hash, role, village, district, state, latitude, longitude)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """,
        (
            user.name,
            user.phone,
            user.email,
            password_hash,
            user.role,
            user.village,
            user.district,
            user.state,
            user.latitude,
            user.longitude
        )
    )

    db.commit()

    user_id = cursor.lastrowid

    cursor.close()
    db.close()

    return {
        "message": "User registered successfully",
        "user_id": user_id,
        "name": user.name,
        "role": user.role
    }

@app.post("/login")
def login_user(form_data: OAuth2PasswordRequestForm = Depends()):

    db = mysql.connector.connect(
        host="localhost",
        user="root",
        password="Harsha@321",
        database="agrirent"
    )

    cursor = db.cursor(dictionary=True)

    try:
        cursor.execute(
            "SELECT * FROM users WHERE phone = %s",
            (form_data.username,)
        )

        existing_user = cursor.fetchone()

        if not existing_user:
            raise HTTPException(
                status_code=401,
                detail="User not found"
            )

        if not bcrypt.checkpw(
            form_data.password.encode("utf-8"),
            existing_user["password_hash"].encode("utf-8")
        ):
            raise HTTPException(
                status_code=401,
                detail="Incorrect password"
            )

        access_token_expires = datetime.utcnow() + timedelta(
            minutes=ACCESS_TOKEN_EXPIRE_MINUTES
        )

        access_token = jwt.encode(
            {
                "user_id": existing_user["user_id"],
                "role": existing_user["role"],
                "exp": access_token_expires
            },
            SECRET_KEY,
            algorithm=ALGORITHM
        )

        return {
            "access_token": access_token,
            "token_type": "bearer"
        }

    finally:
        cursor.close()
        db.close()
class Review(BaseModel):
    booking_id: int
    farmer_id: int
    equipment_id: int
    rating: int
    comment: str


@app.post("/reviews")
def add_review(review: Review):
    cursor = db.cursor()

    cursor.execute(
        """
        INSERT INTO reviews
        (booking_id, farmer_id, equipment_id, rating, comment)
        VALUES (%s, %s, %s, %s, %s)
        """,
        (
            review.booking_id,
            review.farmer_id,
            review.equipment_id,
            review.rating,
            review.comment
        )
    )

    db.commit()

    review_id = cursor.lastrowid

    cursor.close()

    return {
        "message": "Review added successfully",
        "review_id": review_id
    }

class Notification(BaseModel):
    user_id: int
    title: str
    message: str


@app.post("/notifications")
def add_notification(notification: Notification):
    cursor = db.cursor()

    cursor.execute(
        """
        INSERT INTO notifications (user_id, title, message, is_read)
        VALUES (%s, %s, %s, %s)
        """,
        (
            notification.user_id,
            notification.title,
            notification.message,
            0
        )
    )

    db.commit()

    notification_id = cursor.lastrowid

    cursor.close()

    return {
        "message": "Notification added successfully",
        "notification_id": notification_id
    }
from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        return payload

    except jwt.PyJWTError:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )


@app.post("/notify-nearby-owners")
def notify_nearby_owners(data: NearbyOwnerRequest):
    cursor = db.cursor(dictionary=True)

    # Find farmer
    cursor.execute(
        """
        SELECT name
        FROM users
        WHERE user_id = %s
        """,
        (data.farmer_id,)
    )

    farmer = cursor.fetchone()

    if not farmer:
        cursor.close()
        return {
            "message": "Farmer not found",
            "notified_owners": []
        }

    # Get registered owners with location
    cursor.execute(
        """
        SELECT user_id, name, latitude, longitude
        FROM users
        WHERE role = 'owner'
          AND latitude IS NOT NULL
          AND longitude IS NOT NULL
        """
    )

    owners = cursor.fetchall()

    notified_owners = []

    for owner in owners:
        lat1 = math.radians(data.latitude)
        lon1 = math.radians(data.longitude)

        lat2 = math.radians(float(owner["latitude"]))
        lon2 = math.radians(float(owner["longitude"]))

        dlat = lat2 - lat1
        dlon = lon2 - lon1

        a = (
            math.sin(dlat / 2) ** 2
            + math.cos(lat1)
            * math.cos(lat2)
            * math.sin(dlon / 2) ** 2
        )

        c = 2 * math.atan2(
            math.sqrt(a),
            math.sqrt(1 - a)
        )

        distance_km = 6371 * c

        if distance_km <= data.radius_km:
            cursor.execute(
                """
                INSERT INTO notifications
                (user_id, title, message, is_read)
                VALUES (%s, %s, %s, %s)
                """,
                (
                    owner["user_id"],
                    "Farmer Nearby",
                    f"{farmer['name']} is looking for equipment near your location.",
                    0
                )
            )

            notified_owners.append({
                "user_id": owner["user_id"],
                "name": owner["name"],
                "distance_km": round(distance_km, 2)
            })

    db.commit()
    cursor.close()

    return {
        "message": "Nearby owner notifications sent",
        "radius_km": data.radius_km,
        "notified_owners": notified_owners
    }

@app.put("/bookings/{booking_id}/accept")
def accept_booking(booking_id: int):

    db = mysql.connector.connect(
        host="localhost",
        user="root",
        password="Harsha@321",
        database="agrirent"
    )

    cursor = db.cursor()

    cursor.execute(
        """
        UPDATE bookings
        SET status = 'accepted'
        WHERE booking_id = %s
        """,
        (booking_id,)
    )

    db.commit()

    cursor.execute(
        """
        SELECT farmer_id
        FROM bookings
        WHERE booking_id = %s
        """,
        (booking_id,)
    )

    booking = cursor.fetchone()

    if booking:
        farmer_id = booking[0]

        cursor.execute(
            """
            INSERT INTO notifications (user_id, title, message)
            VALUES (%s, %s, %s)
            """,
            (
                farmer_id,
                "Booking Accepted",
                f"Your booking #{booking_id} has been accepted."
            )
        )

        db.commit()

    cursor.close()
    db.close()

    return {
        "message": "Booking accepted successfully",
        "booking_id": booking_id
    }

@app.put("/bookings/{booking_id}/cancel")
def cancel_booking(booking_id: int):

    db = mysql.connector.connect(
        host="localhost",
        user="root",
        password="Harsha@321",
        database="agrirent"
    )

    cursor = db.cursor()

    cursor.execute(
        """
        UPDATE bookings
        SET status = 'cancelled'
        WHERE booking_id = %s
        """,
        (booking_id,)
    )

    db.commit()

    cursor.execute(
        """
        SELECT farmer_id
        FROM bookings
        WHERE booking_id = %s
        """,
        (booking_id,)
    )

    booking = cursor.fetchone()

    if booking:
        farmer_id = booking[0]

        cursor.execute(
            """
            INSERT INTO notifications (user_id, title, message)
            VALUES (%s, %s, %s)
            """,
            (
                farmer_id,
                "Booking Cancelled",
                f"Your booking #{booking_id} has been cancelled."
            )
        )

        db.commit()

    cursor.close()
    db.close()

    return {
        "message": "Booking cancelled successfully",
        "booking_id": booking_id
    }