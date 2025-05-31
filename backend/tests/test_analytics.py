def test_dashboard_metrics_unauthorized(client):
    res = client.get("/api/v1/analytics/dashboard")
    assert res.status_code in (401, 403)

def test_stats_unauthorized(client):
    res = client.get("/api/v1/analytics/stats")
    assert res.status_code in (401, 403)