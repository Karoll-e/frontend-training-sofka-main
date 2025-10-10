// Unified Form Validation for Login and Register
document.addEventListener('DOMContentLoaded', function() {
    // Constants
    const LOADING_TIMEOUT = 2000;
    
    // Error messages constants
    const ERROR_MESSAGES = {
        EMAIL_REQUIRED: 'El correo electrónico es obligatorio',
        EMAIL_INVALID: 'Por favor ingresa un correo electrónico válido',
        PASSWORD_REQUIRED: 'La contraseña es obligatoria',
        PASSWORD_WEAK: 'La contraseña debe tener al menos 6 caracteres',
        NAME_REQUIRED: 'El nombre completo es obligatorio',
        NAME_SHORT: 'El nombre debe tener al menos 3 caracteres',
        PASSWORD_CONFIRM_REQUIRED: 'Confirma tu contraseña',
        PASSWORD_MISMATCH: 'Las contraseñas no coinciden',
    };
    
    // Common validation functions
    const Validators = {
        email: function(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        },
        
        password: function(password) {
            return password.length >= 6;
        },
        
        fullName: function(name) {
            return name.trim().length >= 3;
        },
        
        passwordsMatch: function(password, confirmPassword) {
            return password === confirmPassword;
        }
    };

    // Common error handling
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

    // Initialize Login Form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        initLoginForm();
    }

    // Initialize Register Form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        initRegisterForm();
    }

    // LOGIN FORM INITIALIZATION
    function initLoginForm() {
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const emailError = document.getElementById('emailError');
        const passwordError = document.getElementById('passwordError');

        // Validate email
        function validateEmailField() {
            const email = emailInput.value.trim();
            
            if (email === '') {
                showError(emailError, ERROR_MESSAGES.EMAIL_REQUIRED);
                return false;
            }
            
            if (!Validators.email(email)) {
                showError(emailError, ERROR_MESSAGES.EMAIL_INVALID);
                return false;
            }
            
            clearError(emailError);
            return true;
        }

        // Validate password
        function validatePasswordField() {
            const password = passwordInput.value;
            
            if (password === '') {
                showError(passwordError, 'La contraseña es obligatoria');
                return false;
            }
            
            if (!Validators.password(password)) {
                showError(passwordError, 'La contraseña debe tener al menos 6 caracteres');
                return false;
            }
            
            clearError(passwordError);
            return true;
        }

        // Event listeners
        emailInput.addEventListener('blur', validateEmailField);
        passwordInput.addEventListener('blur', validatePasswordField);
        
        emailInput.addEventListener('focus', function() {
            clearError(emailError);
        });
        
        passwordInput.addEventListener('focus', function() {
            clearError(passwordError);
        });

        // Form submission
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const isEmailValid = validateEmailField();
            const isPasswordValid = validatePasswordField();

            if (isEmailValid && isPasswordValid) {
                const submitButton = loginForm.querySelector('.btn-get-started');
                const originalText = submitButton.textContent;
                
                submitButton.textContent = 'Iniciando sesión...';
                submitButton.disabled = true;

                setTimeout(function() {
                    window.location.href = 'dashboard.html';
                }, LOADING_TIMEOUT);
            }
        });
    }

    // REGISTER FORM INITIALIZATION
    function initRegisterForm() {
        const fullNameInput = document.getElementById('fullName');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirmPassword');
        
        const fullNameError = document.getElementById('fullNameError');
        const emailError = document.getElementById('emailError');
        const passwordError = document.getElementById('passwordError');
        const confirmPasswordError = document.getElementById('confirmPasswordError');

        // Validate full name
        function validateFullNameField() {
            const fullName = fullNameInput.value.trim();
            
            if (fullName === '') {
                showError(fullNameError, ERROR_MESSAGES.NAME_REQUIRED);
                return false;
            }
            
            if (!Validators.fullName(fullName)) {
                showError(fullNameError, ERROR_MESSAGES.NAME_SHORT);
                return false;
            }
            
            clearError(fullNameError);
            return true;
        }

        // Validate email
        function validateEmailField() {
            const email = emailInput.value.trim();
            
            if (email === '') {
                showError(emailError, 'El correo electrónico es obligatorio');
                return false;
            }
            
            if (!Validators.email(email)) {
                showError(emailError, 'Ingresa un correo electrónico válido');
                return false;
            }
            
            clearError(emailError);
            return true;
        }

        // Validate password
        function validatePasswordField() {
            const password = passwordInput.value;
            
            if (password === '') {
                showError(passwordError, 'La contraseña es obligatoria');
                return false;
            }
            
            if (!Validators.password(password)) {
                showError(passwordError, 'La contraseña debe tener al menos 6 caracteres');
                return false;
            }
            
            clearError(passwordError);
            return true;
        }

        // Validate confirm password
        function validateConfirmPasswordField() {
            const password = passwordInput.value;
            const confirmPassword = confirmPasswordInput.value;
            
            if (confirmPassword === '') {
                showError(confirmPasswordError, 'Confirma tu contraseña');
                return false;
            }
            
            if (!Validators.passwordsMatch(password, confirmPassword)) {
                showError(confirmPasswordError, 'Las contraseñas no coinciden');
                return false;
            }
            
            clearError(confirmPasswordError);
            return true;
        }

        // Event listeners
        fullNameInput.addEventListener('blur', validateFullNameField);
        emailInput.addEventListener('blur', validateEmailField);
        passwordInput.addEventListener('blur', validatePasswordField);
        confirmPasswordInput.addEventListener('blur', validateConfirmPasswordField);

        // Re-validate confirm password when password changes
        passwordInput.addEventListener('input', function() {
            if (confirmPasswordInput.value !== '') {
                validateConfirmPasswordField();
            }
        });

        // Clear errors on focus
        fullNameInput.addEventListener('focus', function() {
            clearError(fullNameError);
        });
        
        emailInput.addEventListener('focus', function() {
            clearError(emailError);
        });
        
        passwordInput.addEventListener('focus', function() {
            clearError(passwordError);
        });
        
        confirmPasswordInput.addEventListener('focus', function() {
            clearError(confirmPasswordError);
        });


        // Form submission
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const isFullNameValid = validateFullNameField();
            const isEmailValid = validateEmailField();
            const isPasswordValid = validatePasswordField();
            const isConfirmPasswordValid = validateConfirmPasswordField();
        
            if (isFullNameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid) {
                const submitButton = registerForm.querySelector('.btn-get-started');
                const originalText = submitButton.textContent;
                
                submitButton.textContent = 'Creando cuenta...';
                submitButton.disabled = true;

                setTimeout(function() {
                    window.location.href = 'dashboard.html';
                }, LOADING_TIMEOUT);
            }
        });
    }
});