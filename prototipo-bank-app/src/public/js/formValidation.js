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
        const cedulaInput = document.getElementById('cedula');
        const passwordInput = document.getElementById('password');
        const cedulaError = document.getElementById('cedulaError');
        const passwordError = document.getElementById('passwordError');

        // Validate cedula
        function validateCedulaField() {
            const cedula = cedulaInput.value.trim();
            
            if (cedula === '') {
                showError(cedulaError, 'La cédula es obligatoria');
                return false;
            }
            
            if (cedula.length < 6) {
                showError(cedulaError, 'La cédula debe tener al menos 6 caracteres');
                return false;
            }
            
            clearError(cedulaError);
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
        cedulaInput.addEventListener('blur', validateCedulaField);
        passwordInput.addEventListener('blur', validatePasswordField);
        
        cedulaInput.addEventListener('focus', function() {
            clearError(cedulaError);
        });
        
        passwordInput.addEventListener('focus', function() {
            clearError(passwordError);
        });

        // Form submission
        loginForm.addEventListener('submit', function(e) {
            // Only prevent default for client-side validation
            const isCedulaValid = validateCedulaField();
            const isPasswordValid = validatePasswordField();

            if (!isCedulaValid || !isPasswordValid) {
                e.preventDefault();
                return false;
            }

            // Allow form to submit to server
            const submitButton = loginForm.querySelector('.btn-get-started');
            submitButton.textContent = 'Iniciando sesión...';
            submitButton.disabled = true;
        });
    }

    // REGISTER FORM INITIALIZATION
    function initRegisterForm() {
        // Get all form inputs - check if they exist first
        const cedulaInput = document.getElementById('cedula');
        const nombreInput = document.getElementById('nombre');
        const apellidoInput = document.getElementById('apellido');
        const emailInput = document.getElementById('email');
        const telefonoInput = document.getElementById('telefono');
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirmPassword');
        
        const cedulaError = document.getElementById('cedulaError');
        const nombreError = document.getElementById('nombreError');
        const apellidoError = document.getElementById('apellidoError');
        const emailError = document.getElementById('emailError');
        const telefonoError = document.getElementById('telefonoError');
        const passwordError = document.getElementById('passwordError');
        const confirmPasswordError = document.getElementById('confirmPasswordError');

        // Validate required field
        function validateRequiredField(input, errorElement, fieldName) {
            const value = input.value.trim();
            
            if (value === '') {
                showError(errorElement, `${fieldName} es obligatorio`);
                return false;
            }
            
            if (value.length < 2) {
                showError(errorElement, `${fieldName} debe tener al menos 2 caracteres`);
                return false;
            }
            
            clearError(errorElement);
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
            
            if (password.length < 8) {
                showError(passwordError, 'La contraseña debe tener al menos 8 caracteres');
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

        // Add event listeners if elements exist
        if (cedulaInput) {
            cedulaInput.addEventListener('blur', () => validateRequiredField(cedulaInput, cedulaError, 'La cédula'));
            cedulaInput.addEventListener('focus', () => clearError(cedulaError));
        }

        if (nombreInput) {
            nombreInput.addEventListener('blur', () => validateRequiredField(nombreInput, nombreError, 'El nombre'));
            nombreInput.addEventListener('focus', () => clearError(nombreError));
        }

        if (apellidoInput) {
            apellidoInput.addEventListener('blur', () => validateRequiredField(apellidoInput, apellidoError, 'El apellido'));
            apellidoInput.addEventListener('focus', () => clearError(apellidoError));
        }

        if (telefonoInput) {
            telefonoInput.addEventListener('blur', () => validateRequiredField(telefonoInput, telefonoError, 'El teléfono'));
            telefonoInput.addEventListener('focus', () => clearError(telefonoError));
        }

        if (emailInput) {
            emailInput.addEventListener('blur', validateEmailField);
            emailInput.addEventListener('focus', () => clearError(emailError));
        }

        if (passwordInput) {
            passwordInput.addEventListener('blur', validatePasswordField);
            passwordInput.addEventListener('focus', () => clearError(passwordError));
            // Re-validate confirm password when password changes
            passwordInput.addEventListener('input', function() {
                if (confirmPasswordInput.value !== '') {
                    validateConfirmPasswordField();
                }
            });
        }

        if (confirmPasswordInput) {
            confirmPasswordInput.addEventListener('blur', validateConfirmPasswordField);
            confirmPasswordInput.addEventListener('focus', () => clearError(confirmPasswordError));
        }


        // Form submission
        registerForm.addEventListener('submit', function(e) {
            // Validate all fields
            let isValid = true;

            if (cedulaInput) isValid = validateRequiredField(cedulaInput, cedulaError, 'La cédula') && isValid;
            if (nombreInput) isValid = validateRequiredField(nombreInput, nombreError, 'El nombre') && isValid;
            if (apellidoInput) isValid = validateRequiredField(apellidoInput, apellidoError, 'El apellido') && isValid;
            if (telefonoInput) isValid = validateRequiredField(telefonoInput, telefonoError, 'El teléfono') && isValid;
            if (emailInput) isValid = validateEmailField() && isValid;
            if (passwordInput) isValid = validatePasswordField() && isValid;
            if (confirmPasswordInput) isValid = validateConfirmPasswordField() && isValid;
        
            if (!isValid) {
                e.preventDefault();
                return false;
            }

            // Allow form to submit to server
            const submitButton = registerForm.querySelector('.btn-get-started');
            submitButton.textContent = 'Creando cuenta...';
            submitButton.disabled = true;
        });
    }
});