from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models import Order, OrderItem, Product, User
from app.api.deps import require_admin
from datetime import datetime, timedelta

router = APIRouter()

@router.get("/dashboard")
async def get_dashboard_metrics(
    db: Session = Depends(get_db),
    admin = Depends(require_admin)
):
    thirty_days_ago = datetime.now() - timedelta(days=30)
    
    # Total sales
    total_sales = db.query(func.sum(Order.total_price))\
        .filter(Order.created_at >= thirty_days_ago).scalar() or 0
        
    # Top products
    top_products = db.query(
        Product.name,
        func.sum(OrderItem.quantity).label('total_sold'),
        func.sum(OrderItem.quantity * OrderItem.price).label('revenue')
    ).join(OrderItem).group_by(Product.id)\
        .order_by(func.sum(OrderItem.quantity).desc())\
        .limit(5).all()
    
    return {
        "total_sales": float(total_sales),
        "top_products": [
            {
                "name": p.name,
                "total_sold": p.total_sold,
                "revenue": float(p.revenue)
            }
            for p in top_products
        ]
    }

@router.get("/sales-data")
async def get_sales_data(
    db: Session = Depends(get_db),
    admin = Depends(require_admin)
):
    from app.db.models import Order
    days = 30
    today = datetime.now().date()
    sales_by_day = (
        db.query(
            func.date(Order.created_at).label("date"),
            func.sum(Order.total_price).label("total")
        )
        .filter(Order.created_at >= today - timedelta(days=days))
        .group_by(func.date(Order.created_at))
        .order_by(func.date(Order.created_at))
        .all()
    )
    labels = [str(row.date) for row in sales_by_day]
    values = [float(row.total) for row in sales_by_day]
    return {"labels": labels, "values": values}

@router.get("/stats")
def get_stats(
    db: Session = Depends(get_db),
    admin = Depends(require_admin)
):
    orders = db.query(Order).all()
    total_users = db.query(User).count()
    total_orders = db.query(Order).count()
    total_products = db.query(Product).count()
    total_sales = sum(order.total_price for order in orders)

    return {
        "totalCustomers": total_users,
        "totalOrders": total_orders,
        "totalProducts": total_products,
        "totalRevenue": float(total_sales),
    }