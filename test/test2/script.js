document.addEventListener('DOMContentLoaded', function() {
    const exchangeSelector = document.getElementById('exchange-selector');
    const themeSelector = document.getElementById('theme-selector');
    const tabButtons = document.querySelectorAll('.tab-button');
    const tableBody = document.querySelector('#stock-table tbody');

    let currentExchange = exchangeSelector.value;
    let currentList = 0;

    exchangeSelector.addEventListener('change', function() {
        currentExchange = this.value;
        fetchData();
    });

    themeSelector.addEventListener('change', function() {
        document.body.className = this.value + '-theme';
    });

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            currentList = this.getAttribute('data-list');
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            fetchData();
        });
    });

    function fetchData() {
        const url = `https://livefeed3.chartnexus.com/Dummy/quotes?market_id=${currentExchange}&list=${currentList}`;
        fetch(url)
            .then(response => response.json())
            .then(data => updateTable(data))
            .catch(error => console.error('Error fetching data:', error));
    }

    function updateTable(data) {
        tableBody.innerHTML = '';
        data.forEach(stock => {
            const row = document.createElement('tr');
            const previousRow = document.querySelector(`tr[data-stockcode="${stock.stockcode}"]`);
            const flashClass = 'highlight';

            row.setAttribute('data-stockcode', stock.stockcode);
            row.innerHTML = `
                <td>${stock.stockcode}<br>
                 ${stock.name}</td>
                 <td class="${stock.last - stock.previous >= 0 ? 'positive' : 'negative'}">${(stock.last - stock.previous).toFixed(2)}<br>
                <${stock.last - stock.previous >= 0 ? 'positive' : 'negative'}">${((stock.last - stock.previous) / stock.previous * 100).toFixed(2)}%</td>
                <td class="${(stock.last) >= 0 ? 'positive' : 'negative'}">${(stock.last).toFixed(2)}<br>
                <${stock.last - stock.previous >= 0 ? 'positive' : 'negative'}">${( (100 *stock.last - stock.previous)/ stock.previous ).toFixed(2)}%</td>
                <td>${stock.volume}<br>
                ${stock.buy_volume}</td>
                <td>${stock.buy_price}<br>
                ${stock.sell_price}</td>
                
            `;

            if (previousRow) {
                Array.from(row.children).forEach((cell, index) => {
                    if (cell.textContent !== previousRow.children[index].textContent) {
                        cell.classList.add(flashClass);
                        setTimeout(() => cell.classList.remove(flashClass), 1000);
                    }
                });
            }
            tableBody.appendChild(row);
        });
    }

    // Initial fetch and polling
    fetchData();
    setInterval(fetchData, 5000);
});