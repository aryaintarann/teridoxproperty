-- Create tables

CREATE TABLE IF NOT EXISTS units (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    property TEXT NOT NULL,
    location TEXT NOT NULL,
    address TEXT NOT NULL,
    price TEXT NOT NULL,
    price_numeric INTEGER NOT NULL,
    type TEXT NOT NULL,
    status TEXT NOT NULL,
    rating NUMERIC(2,1) NOT NULL,
    sqft TEXT,
    bed_type TEXT,
    floor_level TEXT,
    description TEXT,
    images JSONB,
    amenities JSONB,
    agent JSONB
);

CREATE TABLE IF NOT EXISTS tenants (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    unit TEXT NOT NULL,
    status TEXT NOT NULL,
    joined_at DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS contracts (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL,
    tenant_name TEXT NOT NULL,
    unit TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS billing (
    id TEXT PRIMARY KEY,
    tenant_name TEXT NOT NULL,
    unit TEXT NOT NULL,
    type TEXT NOT NULL,
    amount TEXT NOT NULL,
    due_date DATE NOT NULL,
    status TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS maintenance (
    id TEXT PRIMARY KEY,
    unit TEXT NOT NULL,
    reported_by TEXT NOT NULL,
    issue TEXT NOT NULL,
    priority TEXT NOT NULL,
    status TEXT NOT NULL,
    date DATE NOT NULL
);

-- Seed Data for Tenants
INSERT INTO tenants (id, name, email, phone, unit, status, joined_at) VALUES
('T001', 'Budi Santoso', 'budi.s@example.com', '081234567890', 'A-101', 'Active', '2023-01-15'),
('T002', 'Siti Aminah', 'siti.a@example.com', '081298765432', 'B-205', 'Active', '2023-05-20'),
('T003', 'Andi Wijaya', 'andi.w@example.com', '085671234567', 'A-201', 'Active', '2024-02-10'),
('T004', 'Reza Rahadian', 'reza.r@example.com', '081987654321', 'A-105', 'Inactive', '2022-11-01'),
('T005', 'Diana Putri', 'diana.p@example.com', '081122334455', 'A-102', 'Active', '2023-08-05')
ON CONFLICT DO NOTHING;

-- Seed Data for Contracts
INSERT INTO contracts (id, tenant_id, tenant_name, unit, start_date, end_date, status) VALUES
('C1001', 'T001', 'Budi Santoso', 'A-101', '2023-01-15', '2026-01-15', 'Active'),
('C1002', 'T002', 'Siti Aminah', 'B-205', '2023-05-20', '2026-05-20', 'Active'),
('C1003', 'T003', 'Andi Wijaya', 'A-201', '2024-02-10', '2027-02-10', 'Active'),
('C1004', 'T004', 'Reza Rahadian', 'A-105', '2022-11-01', '2023-11-01', 'Expired'),
('C1005', 'T005', 'Diana Putri', 'A-102', '2023-08-05', '2026-08-10', 'Expiring Soon')
ON CONFLICT DO NOTHING;

-- Seed Data for Billing
INSERT INTO billing (id, tenant_name, unit, type, amount, due_date, status) VALUES
('INV-2026-08-01', 'Budi Santoso', 'A-101', 'Rent', 'Rp 2.500.000', '2026-08-05', 'Paid'),
('INV-2026-08-02', 'Siti Aminah', 'B-205', 'Rent + Utility', 'Rp 3.800.000', '2026-08-05', 'Pending'),
('INV-2026-08-03', 'Andi Wijaya', 'A-201', 'Rent', 'Rp 5.200.000', '2026-08-05', 'Paid'),
('INV-2026-07-04', 'Diana Putri', 'A-102', 'Utility', 'Rp 450.000', '2026-07-25', 'Overdue')
ON CONFLICT DO NOTHING;

-- Seed Data for Maintenance
INSERT INTO maintenance (id, unit, reported_by, issue, priority, status, date) VALUES
('MT-001', 'A-102', 'Diana Putri', 'AC Leaking', 'High', 'In Progress', '2026-08-01'),
('MT-002', 'B-205', 'Siti Aminah', 'Broken Door Lock', 'Medium', 'New', '2026-08-02'),
('MT-003', 'A-101', 'Budi Santoso', 'Burnt Lightbulb', 'Low', 'Resolved', '2026-07-28')
ON CONFLICT DO NOTHING;

-- Seed Data for Units
INSERT INTO units (id, name, property, location, address, price, price_numeric, type, status, rating, sqft, bed_type, floor_level, description, images, amenities, agent) VALUES
(1, 'Teridox Heights A12', 'Teridox Heights', 'Kuningan, Jakarta Selatan', 'Jl. Rasuna Said, Kuningan, Jakarta Selatan 12940', 'Rp 2.500.000', 2500000, 'Studio', 'Tersedia', 4.8, '36.5 m²', 'Queen Size', 'Lantai 12', 'Rasakan puncak hunian urban di Teridox Heights A12...', 
'["https://lh3.googleusercontent.com/aida-public/AB6AXuDBoAqAfY_wppKKneRIA81VG4G6ST_lZDkbekRUNwOXOoeRbUgV7egGWsYtKD2MsXZMdYr8LzlIzweV1pHspjSYDbDd1BfS8V2UmopR4ZNf5L-SpWglU3bjL_yIa9MSbEjjJ0YEwPnv_Ri6WzxjQRB79b0cDChz0but7PBBfILXPzgFh7Jw6H-jQxIXmxW7uI5bgvgrlXrwg9YEzOXCLQE3IOb7PBWNnMcgdyVmD9LBXTLt0NMheMBMgA"]'::jsonb, 
'[{"icon": "wifi", "label": "WiFi"}, {"icon": "ac_unit", "label": "AC"}, {"icon": "shower", "label": "Kamar Mandi Dalam"}]'::jsonb, 
'{"name": "Sarah Wijaya", "title": "Agen Utama", "rating": 4.9, "photo": "https://lh3.googleusercontent.com/aida-public/AB6AXuB1r47bSiri4pxlhnLdZHUjAJSk0_S4W3QLD7drx_DRhvA1Ls15W3OctJXqAZJrEWZ5cjqBiXRcbtSsxQWeMhoWjp20rZHiSta3e2i-jmLN_FN-m0BVeouzYIuRz7vsRS-QCSijDwdgKr_PaJqziSaklyyZpNsBhiovbtJWYQoh8-HJ73WonV_Obk3k8WDZqZ91bZWQJk_Nj0AbuL6xh4g1qLYRB4h_pcpX_xtTOGK9i8Yhq_IQVf_Reg"}'::jsonb),
(2, 'Urban Loft C-04', 'Urban Loft Residence', 'Senayan, Jakarta Pusat', 'Jl. Asia Afrika, Senayan, Jakarta Pusat 10270', 'Rp 3.800.000', 3800000, 'Loft', 'Maintenance', 4.9, '48 m²', 'King Size', 'Lantai 4', 'Unit loft bergaya industrial modern di kawasan elit Senayan...', 
'["https://lh3.googleusercontent.com/aida-public/AB6AXuC-dWVBFA9QncwqbifG9WYWtW2rw-kfP9kHdShRtz7ueKd1ofX8BU8yXkbZs-PFvgd84RJJNTdyEtjsUUIuP4MXNnS7PcTHvc1UvQZDWXL_sYufvtwK5P7Owmdio-_NRwtvtcEc3y40Hiy_cQEnTTSv1EcbDELacLy2m1YT0zcwpJscOgavE18Vqc4YxB2j-OBdHx6iQ-HdKGI867JgOT6Yk18bv4nm6YJ6CC8OJ1YF7YbzS5271_CYmw"]'::jsonb, 
'[{"icon": "ac_unit", "label": "AC"}, {"icon": "security", "label": "Keamanan 24 Jam"}]'::jsonb, 
'{"name": "Sarah Wijaya", "title": "Agen Utama", "rating": 4.9, "photo": "https://lh3.googleusercontent.com/aida-public/AB6AXuB1r47bSiri4pxlhnLdZHUjAJSk0_S4W3QLD7drx_DRhvA1Ls15W3OctJXqAZJrEWZ5cjqBiXRcbtSsxQWeMhoWjp20rZHiSta3e2i-jmLN_FN-m0BVeouzYIuRz7vsRS-QCSijDwdgKr_PaJqziSaklyyZpNsBhiovbtJWYQoh8-HJ73WonV_Obk3k8WDZqZ91bZWQJk_Nj0AbuL6xh4g1qLYRB4h_pcpX_xtTOGK9i8Yhq_IQVf_Reg"}'::jsonb),
(3, 'Eco Residence G-09', 'Eco Residence', 'BSD, Tangerang', 'Jl. BSD Raya, Tangerang Selatan 15345', 'Rp 1.800.000', 1800000, 'Standard', 'Tersedia', 4.6, '24 m²', 'Single', 'Lantai 9', 'Kamar standar yang bersih dan terang dengan desain Skandinavia minimalis...', 
'["https://lh3.googleusercontent.com/aida-public/AB6AXuDmZ9Q1Q86MU5GK-zAZSw_EYgv8TKphbQqFt4c2GFRauE1T9yATOUq45Z_IXggnHjX4NLyKOyTzfwo1CGTe--VA_lEDKeYXfFSMLy3LXQt5JOQGoHrldvvTJiJmZMI8KAIWh3Ji5UuU-Iza1UlA8p9bjFcuXAz3DeQr_0K9UVApnCzyUR99aWb0GQkVoKuMbqHqh44JRBpgAwZ9yBIybZ8OgFBNExCE7HZtDEoLFZZoFzb86C3sP5xf0A"]'::jsonb, 
'[{"icon": "mode_fan", "label": "Non-AC"}, {"icon": "cleaning_services", "label": "Laundry Mingguan"}]'::jsonb, 
null)
ON CONFLICT DO NOTHING;
