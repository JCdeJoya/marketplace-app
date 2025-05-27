def test_dashboard_metrics(client, admin_token_headers):
    res = client.get("/api/v1/analytics/dashboard", headers=admin_token_headers)
    assert res.status_code == 200
    data = res.json()
    assert "total_sales" in data
    assert "top_products" in data

def test_stats(client, admin_token_headers):
    res = client.get("/api/v1/analytics/stats", headers=admin_token_headers)
    assert res.status_code == 200
    data = res.json()
    assert "total_users" in data
    assert "total_orders" in data
    assert "total_products" in data
    assert "total_sales" in data