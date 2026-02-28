-- Seed data for properties table
INSERT INTO properties (address, city, state, zip, lat, lng, list_price, equity_gap, sqft, bedrooms, bathrooms, decision, strategy, rationale, type) VALUES
('309 E Brandon St', 'Overton', 'TX', '75684', 32.2757, -94.9427, 149900, 25000, 1700, 3, 3, 'Pass Platinum', 'Section 8', 'Multi-family potential in rental desert; high yield', 'Multi-family home for sale'),
('2319 Luther St', 'Tyler', 'TX', '75701', 32.3513, -95.3011, 99999, 125001, 1909, 4, 2, 'Pass Platinum', 'Retail Flip', 'Massive equity gap; tax value $225k vs $100k list', 'House for sale'),
('1525 Stone Creek Blvd', 'Longview', 'TX', '75601', 32.5007, -94.7405, 185000, 45000, 2200, 4, 2.5, 'Pass Gold', 'BRRR', 'Strong rental market; good cash flow potential', 'House for sale'),
('8902 Sunnyvale Dr', 'Tyler', 'TX', '75703', 32.3513, -95.3011, 215000, 35000, 1950, 3, 2, 'Pass Gold', 'Owner Finance', 'Owner financing available; great location near schools', 'House for sale'),
('456 Oak Street', 'Marshall', 'TX', '75670', 32.5449, -94.3674, 89500, 30000, 1450, 3, 2, 'Pass Gold', 'Wholesaling', 'Below market value; motivated seller', 'House for sale');
