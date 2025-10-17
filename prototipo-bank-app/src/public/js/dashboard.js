// Dashboard Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const sendMoneyForm = document.getElementById('sendMoneyForm');
    const sourceAccountSelect = document.getElementById('sourceAccount');
    const recipientInput = document.getElementById('recipientAccount');
    const amountInput = document.getElementById('amount');
    const descriptionInput = document.getElementById('description');

    // Error elements
    const sourceError = document.getElementById('sourceError');
    const recipientError = document.getElementById('recipientError');
    const amountError = document.getElementById('amountError');

    // Constants
    const ANIMATION_TIMEOUT = 300;
    
    // Get current balance from selected account
    function getCurrentAccountBalance() {
        if (!sourceAccountSelect || !sourceAccountSelect.value) {
            return 0;
        }
        const selectedOption = sourceAccountSelect.options[sourceAccountSelect.selectedIndex];
        const balance = selectedOption.getAttribute('data-balance');
        return parseFloat(balance) || 0;
    }

    // Validation functions
    function validateAccountNumber(account) {
        // Simple validation: must be numeric and between 8-16 digits
        const accountRegex = /^\d{8,16}$/;
        return accountRegex.test(account.replace(/\s/g, ''));
    }

    function validateAmount(amount) {
        const numAmount = parseFloat(amount);
        const currentBalance = getCurrentAccountBalance();
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

    // Validate source account
    function validateSourceField() {
        if (!sourceAccountSelect) return true; // If field doesn't exist, skip validation
        
        const sourceAccount = sourceAccountSelect.value;
        
        if (sourceAccount === '') {
            showError(sourceError, 'Selecciona una cuenta origen');
            return false;
        }
        
        clearError(sourceError);
        return true;
    }

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
    if (sourceAccountSelect) {
        sourceAccountSelect.addEventListener('change', function() {
            validateSourceField();
            // Re-validate amount when account changes (balance changes)
            if (amountInput.value) {
                validateAmountField();
            }
        });
        
        sourceAccountSelect.addEventListener('focus', function() {
            clearError(sourceError);
        });
    }
    
    recipientInput.addEventListener('blur', validateRecipientField);
    amountInput.addEventListener('blur', validateAmountField);

    recipientInput.addEventListener('focus', function() {
        clearError(recipientError);
    });

    amountInput.addEventListener('focus', function() {
        clearError(amountError);
    });

    // Send money form submission
    if (sendMoneyForm) {
        sendMoneyForm.addEventListener('submit', function(e) {
            const isSourceValid = validateSourceField();
            const isRecipientValid = validateRecipientField();
            const isAmountValid = validateAmountField();

            if (!isSourceValid || !isRecipientValid || !isAmountValid) {
                e.preventDefault();
                return false;
            }

            // Remove spaces from account number before submitting
            if (recipientInput && recipientInput.value) {
                recipientInput.value = recipientInput.value.replace(/\s/g, '');
            }

            // Allow form to submit to server
            const submitButton = sendMoneyForm.querySelector('.btn-primary');
            if (submitButton) {
                submitButton.innerHTML = '<span class="material-symbols-outlined">hourglass_empty</span> Procesando...';
                submitButton.disabled = true;
            }
        });
    }

    // Format account input to add spaces
    if (recipientInput) {
        recipientInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s/g, '');
            let formattedValue = value.replace(/(\d{4})/g, '$1 ').trim();
            e.target.value = formattedValue;
        });
    }

    // Auto-hide success/error messages after 5 seconds
    const messageContainer = document.querySelector('.message-container');
    if (messageContainer && messageContainer.style.display !== 'none') {
        setTimeout(function() {
            messageContainer.style.display = 'none';
        }, 5000);
    }
});