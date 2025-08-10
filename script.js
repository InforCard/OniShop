let products = [];
let currentPage = 1;
const itemsPerPage = 10;

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
            <h5 class="productName">${product.name}</h5>
            <button onclick="window.open('${product.link}', '_blank')">Đến Shopee</button>
        `;
        productGrid.appendChild(productCard);
    });
}

// Filter products based on search query and category
function filterProducts() {
    const searchValue = document.getElementById('search-input').value.toLowerCase();
    const categoryValue = document.getElementById('category-filter').value;
    return products.filter(product =>
        product.name.toLowerCase().includes(searchValue) &&
        (categoryValue === '' || product.category === categoryValue)
    );
}

// Render pagination buttons
function renderPagination() {
    const paginationContainer = document.querySelector('.pagination');
    paginationContainer.innerHTML = '';
    const filteredProducts = filterProducts();
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    if (totalPages <= 1) return; // Không cần hiển thị phân trang nếu chỉ có 1 trang

    // Nút "prev" để quay về trang trước
    const prevButton = document.createElement('button');
    prevButton.textContent = '«';
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderProducts();
            renderPagination();
        }
    });
    paginationContainer.appendChild(prevButton);

    const maxVisibleButtons = 3; // Số nút hiển thị giữa (ví dụ: 1 2 3 ... cuối)

    // Hiển thị trang đầu tiên
    const firstButton = document.createElement('button');
    firstButton.textContent = '1';
    firstButton.addEventListener('click', () => {
        currentPage = 1;
        renderProducts();
        renderPagination();
    });
    if (currentPage === 1) {
        firstButton.classList.add('active');
    }
    paginationContainer.appendChild(firstButton);

    // Hiển thị "..." nếu cần thiết
    if (currentPage > maxVisibleButtons + 1) {
        const dots = document.createElement('span');
        dots.textContent = '...';
        paginationContainer.appendChild(dots);
    }

    // Hiển thị các nút giữa
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    for (let i = startPage; i <= endPage; i++) {
        const button = document.createElement('button');
        button.textContent = i;
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

    // Hiển thị "..." nếu cần thiết trước trang cuối cùng
    if (currentPage < totalPages - maxVisibleButtons) {
        const dots = document.createElement('span');
        dots.textContent = '...';
        paginationContainer.appendChild(dots);
    }

    // Hiển thị trang cuối cùng
    if (totalPages > 1) {
        const lastButton = document.createElement('button');
        lastButton.textContent = totalPages;
        lastButton.addEventListener('click', () => {
            currentPage = totalPages;
            renderProducts();
            renderPagination();
        });
        if (currentPage === totalPages) {
            lastButton.classList.add('active');
        }
        paginationContainer.appendChild(lastButton);
    }

    // Nút "next" để sang trang tiếp theo
    const nextButton = document.createElement('button');
    nextButton.textContent = '»';
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderProducts();
            renderPagination();
        }
    });
    paginationContainer.appendChild(nextButton);
}

// Event listener for search button click
document.getElementById('search-btn').addEventListener('click', () => {
    currentPage = 1;
    renderProducts();
    renderPagination();
});

// Event listener for pressing Enter key in search input
document.getElementById('search-input').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        currentPage = 1;
        renderProducts();
        renderPagination();
    }
});

// Event listener for category filter change
document.getElementById('category-filter').addEventListener('change', () => {
    currentPage = 1;
    renderProducts();
    renderPagination();
});

// Event listener for clicking on the title to reset to all products
document.getElementById('shop-title').addEventListener('click', () => {
    document.getElementById('search-input').value = '';
    document.getElementById('category-filter').value = '';
    currentPage = 1;
    renderProducts();
    renderPagination();
});

// Initial fetch and render
fetchProducts();