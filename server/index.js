const express = require('express');
const cors = require('cors');
const products = require('./data');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    console.log('Body:', req.body);
    console.log('Query:', req.query);
    next();
});

function applyFilters(products, filters, globalFilter) {
    let filteredProducts = [...products];

    // Apply field filters
    if (filters && Object.keys(filters).length > 0) {
        console.log('Applying filters:', filters);
        filteredProducts = filteredProducts.filter(product => {
            return Object.entries(filters).every(([field, constraint]) => {
                if (!constraint || constraint.value === null || constraint.value === undefined || constraint.value === '') {
                    return true;
                }

                const itemValue = product[field];
                const filterValue = constraint.value;
                const matchMode = constraint.matchMode;

                if (typeof itemValue === 'number') {
                    const numericFilter = Number(filterValue);
                    switch (matchMode) {
                        case 'equals':
                            return itemValue === numericFilter;
                        case 'notEquals':
                            return itemValue !== numericFilter;
                        case 'lt':
                            return itemValue < numericFilter;
                        case 'lte':
                            return itemValue <= numericFilter;
                        case 'gt':
                            return itemValue > numericFilter;
                        case 'gte':
                            return itemValue >= numericFilter;
                        default:
                            return itemValue === numericFilter;
                    }
                } else {
                    const strValue = String(itemValue).toLowerCase();
                    const searchValue = String(filterValue).toLowerCase();
                    switch (matchMode) {
                        case 'startsWith':
                            return strValue.startsWith(searchValue);
                        case 'contains':
                            return strValue.includes(searchValue);
                        case 'notContains':
                            return !strValue.includes(searchValue);
                        case 'endsWith':
                            return strValue.endsWith(searchValue);
                        case 'equals':
                            return strValue === searchValue;
                        case 'notEquals':
                            return strValue !== searchValue;
                        default:
                            return strValue.includes(searchValue);
                    }
                }
            });
        });
    }

    // Apply global search if provided
    if (globalFilter) {
        console.log('Applying global filter:', globalFilter);
        const searchValue = globalFilter.toLowerCase();
        filteredProducts = filteredProducts.filter(product => 
            Object.values(product).some(value => 
                String(value).toLowerCase().includes(searchValue)
            )
        );
    }

    return filteredProducts;
}

// Handle both GET and POST
app.route('/products')
    .get((req, res) => {
        try {
            const page = parseInt(req.query.page) || 0;
            const limit = parseInt(req.query.limit) || 10;
            const sortField = req.query.sortField || 'id';
            const sortOrder = parseInt(req.query.sortOrder) || 1;
            const filters = req.query.filters ? JSON.parse(req.query.filters) : {};
            const globalFilter = req.query.globalFilter;

            let filteredProducts = applyFilters(products, filters, globalFilter);

            // Apply sorting
            filteredProducts.sort((a, b) => {
                if (a[sortField] < b[sortField]) return -1 * sortOrder;
                if (a[sortField] > b[sortField]) return 1 * sortOrder;
                return 0;
            });

            const start = page * limit;
            const paginatedProducts = filteredProducts.slice(start, start + limit);

            res.json({
                products: paginatedProducts,
                total: filteredProducts.length,
                skip: start,
                limit
            });
        } catch (error) {
            console.error('Error processing request:', error);
            res.status(500).json({ error: error.message });
        }
    })
    .post((req, res) => {
        try {
            const { page = 0, limit = 10, sortField = 'id', sortOrder = 1, filters = {}, globalFilter } = req.body;

            let filteredProducts = applyFilters(products, filters, globalFilter);

            // Apply sorting
            filteredProducts.sort((a, b) => {
                if (a[sortField] < b[sortField]) return -1 * sortOrder;
                if (a[sortField] > b[sortField]) return 1 * sortOrder;
                return 0;
            });

            const start = page * limit;
            const paginatedProducts = filteredProducts.slice(start, start + limit);

            res.json({
                products: paginatedProducts,
                total: filteredProducts.length,
                skip: start,
                limit
            });
        } catch (error) {
            console.error('Error processing request:', error);
            res.status(500).json({ error: error.message });
        }
    });

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});