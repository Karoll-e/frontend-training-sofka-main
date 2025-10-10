// Dashboard Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const sendMoneyForm = document.getElementById('sendMoneyForm');
    const recipientInput = document.getElementById('recipientAccount');
    const amountInput = document.getElementById('amount');
    const descriptionInput = document.getElementById('description');
    const logoutBtn = document.getElementById('logoutBtn');

    // Error elements
    const recipientError = document.getElementById('recipientError');
    const amountError = document.getElementById('amountError');

    // Constants
    const LOADING_TIMEOUT = 2000;
    const ANIMATION_TIMEOUT = 300;
    
    // Initial balance
    let currentBalance = 25430.50;

    // NOTE: Prototype simplified: replacing in-page message system with alert()

    // Sidebar navigation active state
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();

            // Remove active class from all items
            navItems.forEach(nav => nav.classList.remove('active'));

            // Add active class to clicked item
            this.classList.add('active');

            // Simple prototype alert
            const sectionName = this.querySelector('span:last-child').textContent;
            alert(`Navegando a ${sectionName} (función en desarrollo)`);
        });
    });

    // Validation functions
    function validateAccountNumber(account) {
        // Simple validation: must be numeric and between 8-16 digits
        const accountRegex = /^\d{8,16}$/;
        return accountRegex.test(account.replace(/\s/g, ''));
    }

    function validateAmount(amount) {
        const numAmount = parseFloat(amount);
        return numAmount > 0 && numAmount <= currentBalance;
    }

    // Error handling
    function showError(element, message) {
        if (element) {
            element.textContent = message;
            element.parentElement.classList.add('error');
        }
    }

    function clearError(element) {
        if (element) {
            element.textContent = '';
            element.parentElement.classList.remove('error');
        }
    }

    // Format currency
    function formatCurrency(amount) {
        return '$' + parseFloat(amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }

    // Format date
    function formatDate(date) {
        const options = { 
            day: '2-digit', 
            month: 'short', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return date.toLocaleDateString('es-ES', options);
    }

    // NOTE: Prototype: transaction list and balance visual updates removed.

    // Validate recipient account
    function validateRecipientField() {
        const account = recipientInput.value.trim();
        
        if (account === '') {
            showError(recipientError, 'La cuenta destino es obligatoria');
            return false;
        }
        
        if (!validateAccountNumber(account)) {
            showError(recipientError, 'Número de cuenta inválido (8-16 dígitos)');
            return false;
        }
        
        clearError(recipientError);
        return true;
    }

    // Validate amount
    function validateAmountField() {
        const amount = amountInput.value;
        
        if (amount === '' || parseFloat(amount) <= 0) {
            showError(amountError, 'Ingresa un monto válido');
            return false;
        }
        
        if (!validateAmount(amount)) {
            showError(amountError, 'Saldo insuficiente');
            return false;
        }
        
        clearError(amountError);
        return true;
    }

    // Event listeners for real-time validation
    recipientInput.addEventListener('blur', validateRecipientField);
    amountInput.addEventListener('blur', validateAmountField);

    recipientInput.addEventListener('focus', function() {
        clearError(recipientError);
    });

    amountInput.addEventListener('focus', function() {
        clearError(amountError);
    });

    // Send money form submission
    sendMoneyForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const isRecipientValid = validateRecipientField();
        const isAmountValid = validateAmountField();

        if (isRecipientValid && isAmountValid) {
            const amount = parseFloat(amountInput.value);
            const recipient = recipientInput.value.trim();
            const description = descriptionInput.value.trim() || `Transferencia a cuenta ${recipient}`;
            
            const submitButton = sendMoneyForm.querySelector('.btn-primary');
            const originalText = submitButton.innerHTML;
            
            submitButton.innerHTML = '<span class="material-symbols-outlined">hourglass_empty</span> Procesando...';
            submitButton.disabled = true;

            // Simulate transfer process
            setTimeout(function() {
                // Update internal balance (so validation remains accurate)
                currentBalance = currentBalance - amount;

                // Prototype: use a simple alert instead of UI updates
                alert(`¡Transferencia exitosa! Monto: ${formatCurrency(amount)} enviado a cuenta ${recipient}.`);

                // Reset form and restore button
                sendMoneyForm.reset();
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
            }, LOADING_TIMEOUT);
        }
    });

    // Logout functionality
    logoutBtn.addEventListener('click', function() {
        const confirmLogout = confirm('¿Estás seguro que deseas cerrar sesión?');
        
        if (confirmLogout) {
            // Add animation before redirect
            document.body.style.opacity = '0';
            document.body.style.transition = 'opacity 0.3s ease';
            
            setTimeout(function() {
                window.location.href = 'index.html';
            }, ANIMATION_TIMEOUT);
        }
    });

    // Format account input to add spaces
    recipientInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\s/g, '');
        let formattedValue = value.replace(/(\d{4})/g, '$1 ').trim();
        e.target.value = formattedValue;
    });

    // Prototype: no DOM balance animation required
});