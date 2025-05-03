const productNames = [
    'iPhone 14 Pro', 'Samsung Galaxy S23', 'MacBook Air M2', 'Dell XPS 15',
    'Sony WH-1000XM4', 'Nike Air Max', 'Adidas Ultraboost', 'Kindle Paperwhite',
    'iPad Pro 12.9"', 'LG OLED C2', 'Nintendo Switch OLED', 'PS5 Digital Edition',
    'Apple Watch Series 8', 'Dyson V15', 'Bose QuietComfort 45', 'Canon EOS R6',
    'Air Fryer Pro', 'Instant Pot Duo', 'Fitbit Versa 4', 'Ring Doorbell Pro',
    'AirPods Pro 2', 'Surface Laptop 5', 'Google Pixel 7', 'Echo Dot 5th Gen',"Wakefit Mattress",
    'Puma RS-X', 'OnePlus 11', 'Razer Blade 15', 'HP Spectre x360', 'JBL Flip 6',
    'Oculus Quest 2', 'GoPro Hero 10', 'Fujifilm X-T4', 'Bose SoundLink Flex',
    'Samsung Galaxy Tab S8', 'Lenovo Yoga 9i', 'Asus ROG Zephyrus G14', 'Logitech MX Master 3',
    'Corsair K100 RGB', 'SteelSeries Arctis 7+', 'HyperX Cloud II', 'Razer Huntsman Mini',
    'Apple AirTag', 'Tile Pro', 'Samsung Galaxy Buds 2 Pro', 'Anker PowerCore 26800',
    'Belkin MagSafe Charger', 'Logitech C920 HD Pro', 'Elgato Stream Deck', 'Blue Yeti Microphone',
    'Wacom Intuos Pro', 'HP Envy 32 All-in-One', 'Dell UltraSharp 27 Monitor', 'BenQ PD3220U',
    'Acer Predator X27', 'ASUS ProArt PA32UCX', 'Samsung Odyssey G7', 'LG 34WN80C-B',
    'Razer Raptor 27', 'Acer Swift 3', 'Lenovo ThinkPad X1 Carbon', 'Microsoft Surface Pro 8',
    'Apple Mac Mini M1', 'Dell Inspiron 15', 'HP Pavilion x360', 'Acer Aspire 5',
    'Lenovo IdeaPad 3', 'ASUS ZenBook 14', 'Microsoft Surface Go 3', 'Samsung Galaxy Book Pro 360',
];

const products = Array.from({ length: 100 }, (_, index) => ({
    id: index + 1,
    title: productNames[index % productNames.length],
    price: Math.floor(Math.random() * 1000) + 1,
    description: `High-quality ${productNames[index % productNames.length]} with latest features`,
    category: ['Electronics', 'Clothing', 'Books', 'Food'][Math.floor(Math.random() * 4)]
}));

module.exports = products;