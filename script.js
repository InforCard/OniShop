let products = [];
let currentPage = 1;
const itemsPerPage = 12;

// Fetch products from JSON file
async function fetchProducts() {
    try {
        const response = await fetch('products.json');
        products = await response.json();
        renderProducts();
        renderPagination();
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

function renderProducts() {
    const productGrid = document.querySelector('.product-grid');
    productGrid.innerHTML = '';
    const filteredProducts = filterProducts();

    // Pagination logic
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedProducts = filteredProducts.slice(start, end);

    paginatedProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h5>${product.name}</h5>
            <div class="price-sales"> <!-- Thêm div này để chứa giá và lượt bán -->
                <p class="price">Giá: ${product.price}đ</p>
                <p class="sales">Lượt bán: ${product.sales}</p>
            </div>
            <button onclick="window.open('${product.link}', '_blank')">Xem Sản Phẩm</button>
        `;
        productGrid.appendChild(productCard);
    });
}

// Filter products based on search query
function filterProducts() {
    const searchValue = document.getElementById('search-input').value.toLowerCase();
    return products.filter(product =>
        product.name.toLowerCase().includes(searchValue)
    );
}

// Render pagination buttons
function renderPagination() {
    const paginationContainer = document.querySelector('.pagination');
    paginationContainer.innerHTML = '';
    const filteredProducts = filterProducts();
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;

        // Sử dụng điều kiện thêm class 'active' đúng cách
        if (i === currentPage) {
            button.classList.add('active');
        }

        button.addEventListener('click', () => {
            currentPage = i;
            renderProducts();
            renderPagination();
        });

        paginationContainer.appendChild(button);
    }
}

// Event listener for search button click
document.getElementById('search-btn').addEventListener('click', () => {
    currentPage = 1;
    renderProducts();
    renderPagination();
});

// Event listener for pressing Enter key in search input
document.getElementById('search-input').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') { // Kiểm tra nếu phím Enter được nhấn
        currentPage = 1;
        renderProducts();
        renderPagination();
    }
});

// Event listener for clicking on the title to reset to all products
document.getElementById('shop-title').addEventListener('click', () => {
    // Reset tìm kiếm và phân trang về mặc định
    document.getElementById('search-input').value = '';
    currentPage = 1;
    renderProducts();
    renderPagination();
});

// Initial fetch and render
fetchProducts();
