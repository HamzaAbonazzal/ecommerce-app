USE ecommerce_db;

-- ---------- categories ----------
INSERT INTO categories (name, slug) VALUES
('إلكترونيات', 'electronics'),
('ملابس', 'clothing'),
('كتب', 'books'),
('منزل ومطبخ', 'home-kitchen');

-- ---------- products ----------
INSERT INTO products (name, description, price, stock, image_url, category_id) VALUES
('سماعات لاسلكية', 'سماعات بلوتوث بجودة عالية مع عزل للضوضاء', 89.99, 25, 'https://placehold.co/400x300?text=Headphones', 1),
('ساعة ذكية', 'ساعة ذكية مع تتبع اللياقة ونبضات القلب', 149.50, 15, 'https://placehold.co/400x300?text=Smart+Watch', 1),
('لابتوب 14 بوصة', 'لابتوب خفيف للمهام اليومية والدراسة', 799.00, 8, 'https://placehold.co/400x300?text=Laptop', 1),
('تيشيرت قطني', 'تيشيرت قطن 100% متوفر بعدة ألوان', 19.99, 50, 'https://placehold.co/400x300?text=T-Shirt', 2),
('جاكيت شتوي', 'جاكيت دافئ مقاوم للماء', 79.00, 20, 'https://placehold.co/400x300?text=Jacket', 2),
('كتاب البرمجة الحديثة', 'دليل شامل لتعلم البرمجة من الصفر', 34.99, 40, 'https://placehold.co/400x300?text=Book', 3),
('رواية عربية', 'مجموعة قصص قصيرة لكتّاب عرب', 15.50, 60, 'https://placehold.co/400x300?text=Novel', 3),
('طقم أواني مطبخ', 'طقم 10 قطع مقاوم للحرارة', 129.00, 12, 'https://placehold.co/400x300?text=Kitchen', 4),
('مصباح مكتبي LED', 'مصباح بإضاءة قابلة للتعديل', 24.99, 30, 'https://placehold.co/400x300?text=Lamp', 4);

-- ---------- admin ----------
-- كلمة السر الافتراضية: admin123 (سيتم تشفيرها لاحقاً عند إنشاء endpoint setup)
-- في المرحلة 2 سنكتب سكربت hash، مؤقتاً نضع قيمة فارغة ونحدّثها.
INSERT INTO admins (username, password_hash) VALUES
('admin', '$2a$10$PLACEHOLDER_WE_UPDATE_IN_STEP_2');