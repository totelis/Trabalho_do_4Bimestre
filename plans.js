// Plans page specific JavaScript

let currentStep = 1;
let selectedPlan = null;
let billingPeriod = 'monthly';

// Initialize plans page
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('plans.html')) {
        initializePlansPage();
        setupPlansEventListeners();
    }
});

// Initialize plans page functionality
function initializePlansPage() {
    // Update UI based on login status
    updatePlansUIForUser();
    
    // Set up billing toggle
    setupBillingToggle();
    
    // Set up payment form
    setupPaymentForm();
}

// Setup event listeners for plans page
function setupPlansEventListeners() {
    // Billing toggle
    const billingToggle = document.getElementById('billing-toggle');
    if (billingToggle) {
        billingToggle.addEventListener('change', toggleBillingPeriod);
    }
    
    // Payment form
    const paymentForm = document.getElementById('payment-form');
    if (paymentForm) {
        paymentForm.addEventListener('submit', handlePaymentSubmission);
    }
    
    // Payment method selection
    const paymentMethods = document.querySelectorAll('input[name="payment-method"]');
    paymentMethods.forEach(method => {
        method.addEventListener('change', handlePaymentMethodChange);
    });
    
    // Card input formatting
    setupCardInputFormatting();
}

// Update UI based on user login status
function updatePlansUIForUser() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        updateUIForLoggedInUser();
    }
}

// Billing toggle functionality
function setupBillingToggle() {
    const toggle = document.getElementById('billing-toggle');
    if (toggle) {
        toggle.addEventListener('change', function() {
            billingPeriod = this.checked ? 'yearly' : 'monthly';
            updatePriceDisplay();
            updatePlanButtons();
        });
    }
}

function toggleBillingPeriod() {
    const monthlyPrices = document.querySelectorAll('.monthly-price');
    const yearlyPrices = document.querySelectorAll('.yearly-price');
    
    if (billingPeriod === 'yearly') {
        monthlyPrices.forEach(price => {
            price.style.display = 'none';
            price.classList.add('hidden');
        });
        yearlyPrices.forEach(price => {
            price.style.display = 'inline';
            price.classList.remove('hidden');
        });
    } else {
        monthlyPrices.forEach(price => {
            price.style.display = 'inline';
            price.classList.remove('hidden');
        });
        yearlyPrices.forEach(price => {
            price.style.display = 'none';
            price.classList.add('hidden');
        });
    }
}

function updatePriceDisplay() {
    toggleBillingPeriod();
}

function updatePlanButtons() {
    const planButtons = document.querySelectorAll('.btn-plan');
    planButtons.forEach((button, index) => {
        const planTypes = ['basico', 'padrao', 'premium'];
        const planType = planTypes[index];
        button.setAttribute('onclick', `selectPlan('${planType}', '${billingPeriod}')`);
    });
}

// Plan selection functionality
function selectPlan(planType, period = 'monthly') {
    if (!isLoggedIn) {
        showMessage('Faça login para selecionar um plano!', 'error');
        showLoginModal();
        return;
    }
    
    const plans = JSON.parse(localStorage.getItem('plans')) || [];
    const plan = plans.find(p => p.nome.toLowerCase() === planType);
    
    if (!plan) {
        showMessage('Plano não encontrado!', 'error');
        return;
    }
    
    selectedPlan = {
        ...plan,
        period: period,
        finalPrice: period === 'yearly' ? plan.preco * 0.8 : plan.preco // 20% discount for yearly
    };
    
    // Update payment modal with selected plan info
    updatePaymentModalInfo();
    
    // Show payment modal
    showModal('payment-modal');
    
    // Reset to first step
    currentStep = 1;
    showPaymentStep(1);
}

// Update payment modal with selected plan information
function updatePaymentModalInfo() {
    if (!selectedPlan) return;
    
    document.getElementById('selected-plan-name').textContent = `Plano ${selectedPlan.nome}`;
    
    const periodText = selectedPlan.period === 'yearly' ? '/mês (anual)' : '/mês';
    document.getElementById('selected-plan-price').textContent = `R$ ${selectedPlan.finalPrice.toFixed(2)}${periodText}`;
    
    // Update summary
    document.getElementById('summary-plan').textContent = selectedPlan.nome;
    document.getElementById('summary-period').textContent = selectedPlan.period === 'yearly' ? 'Anual' : 'Mensal';
    document.getElementById('summary-price').textContent = `R$ ${selectedPlan.finalPrice.toFixed(2)}${periodText}`;
    document.getElementById('summary-total').textContent = `R$ ${selectedPlan.finalPrice.toFixed(2)}`;
}

// Payment form setup
function setupPaymentForm() {
    // Pre-fill account info if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        document.getElementById('account-name').value = currentUser.name || '';
        document.getElementById('account-email').value = currentUser.email || '';
    }
}

// Payment step navigation
function nextStep() {
    if (currentStep < 3) {
        if (validateCurrentStep()) {
            currentStep++;
            showPaymentStep(currentStep);
        }
    }
}

function previousStep() {
    if (currentStep > 1) {
        currentStep--;
        showPaymentStep(currentStep);
    }
}

function showPaymentStep(step) {
    // Hide all steps
    document.querySelectorAll('.payment-step').forEach(stepEl => {
        stepEl.classList.remove('active');
    });
    
    // Show current step
    document.querySelector(`[data-step="${step}"]`).classList.add('active');
    
    // Update navigation buttons
    const prevBtn = document.getElementById('prev-step');
    const nextBtn = document.getElementById('next-step');
    const completeBtn = document.getElementById('complete-payment');
    
    prevBtn.style.display = step > 1 ? 'block' : 'none';
    nextBtn.style.display = step < 3 ? 'block' : 'none';
    completeBtn.style.display = step === 3 ? 'block' : 'none';
    
    // Update button text
    if (step === 3) {
        nextBtn.style.display = 'none';
    }
}

// Validate current payment step
function validateCurrentStep() {
    switch (currentStep) {
        case 1:
            return validateAccountInfo();
        case 2:
            return validatePaymentMethod();
        case 3:
            return validateTermsAgreement();
        default:
            return true;
    }
}

function validateAccountInfo() {
    const name = document.getElementById('account-name').value.trim();
    const email = document.getElementById('account-email').value.trim();
    const password = document.getElementById('account-password').value.trim();
    
    if (!name || !email || !password) {
        showMessage('Por favor, preencha todos os campos obrigatórios.', 'error');
        return false;
    }
    
    if (!isValidEmail(email)) {
        showMessage('Por favor, insira um email válido.', 'error');
        return false;
    }
    
    if (password.length < 6) {
        showMessage('A senha deve ter pelo menos 6 caracteres.', 'error');
        return false;
    }
    
    return true;
}

function validatePaymentMethod() {
    const selectedMethod = document.querySelector('input[name="payment-method"]:checked').value;
    
    if (selectedMethod === 'credit-card') {
        return validateCreditCard();
    }
    
    return true; // PIX and Boleto don't need validation at this step
}

function validateCreditCard() {
    const cardNumber = document.getElementById('card-number').value.replace(/\s/g, '');
    const cardName = document.getElementById('card-name').value.trim();
    const cardExpiry = document.getElementById('card-expiry').value.trim();
    const cardCvv = document.getElementById('card-cvv').value.trim();
    
    if (!cardNumber || !cardName || !cardExpiry || !cardCvv) {
        showMessage('Por favor, preencha todos os dados do cartão.', 'error');
        return false;
    }
    
    if (cardNumber.length < 13 || cardNumber.length > 19) {
        showMessage('Número do cartão inválido.', 'error');
        return false;
    }
    
    if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
        showMessage('Data de validade inválida. Use o formato MM/AA.', 'error');
        return false;
    }
    
    if (cardCvv.length < 3 || cardCvv.length > 4) {
        showMessage('CVV inválido.', 'error');
        return false;
    }
    
    return true;
}

function validateTermsAgreement() {
    const termsAgreed = document.getElementById('terms-agreement').checked;
    
    if (!termsAgreed) {
        showMessage('Você deve concordar com os Termos de Uso e Política de Privacidade.', 'error');
        return false;
    }
    
    return true;
}

// Payment method change handler
function handlePaymentMethodChange(event) {
    const selectedMethod = event.target.value;
    
    // Hide all payment forms
    document.querySelectorAll('.payment-form-section').forEach(section => {
        section.classList.add('hidden');
    });
    
    // Show selected payment form
    const formSection = document.getElementById(`${selectedMethod.replace('-', '-')}-form`);
    if (formSection) {
        formSection.classList.remove('hidden');
    }
}

// Card input formatting
function setupCardInputFormatting() {
    const cardNumberInput = document.getElementById('card-number');
    const cardExpiryInput = document.getElementById('card-expiry');
    const cardCvvInput = document.getElementById('card-cvv');
    
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', formatCardNumber);
    }
    
    if (cardExpiryInput) {
        cardExpiryInput.addEventListener('input', formatCardExpiry);
    }
    
    if (cardCvvInput) {
        cardCvvInput.addEventListener('input', formatCardCvv);
    }
}

function formatCardNumber(event) {
    let value = event.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    
    if (formattedValue.length > 19) {
        formattedValue = formattedValue.substring(0, 19);
    }
    
    event.target.value = formattedValue;
}

function formatCardExpiry(event) {
    let value = event.target.value.replace(/\D/g, '');
    
    if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    
    event.target.value = value;
}

function formatCardCvv(event) {
    let value = event.target.value.replace(/\D/g, '');
    
    if (value.length > 4) {
        value = value.substring(0, 4);
    }
    
    event.target.value = value;
}

// Payment submission handler
function handlePaymentSubmission(event) {
    event.preventDefault();
    
    if (!validateCurrentStep()) {
        return;
    }
    
    // Show processing state
    showPaymentProcessing();
    
    // Simulate payment processing
    setTimeout(() => {
        processPayment();
    }, 2000);
}

function showPaymentProcessing() {
    const completeBtn = document.getElementById('complete-payment');
    completeBtn.disabled = true;
    completeBtn.innerHTML = '<div class="loading"></div> Processando...';
}

function processPayment() {
    try {
        // Update user's plan
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser) {
            currentUser.plano_id = selectedPlan.id;
            currentUser.subscription_start = new Date().toISOString();
            currentUser.subscription_period = selectedPlan.period;
            
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            // Update users database
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const userIndex = users.findIndex(u => u.id === currentUser.id);
            if (userIndex !== -1) {
                users[userIndex] = currentUser;
                localStorage.setItem('users', JSON.stringify(users));
            }
        }
        
        // Create subscription record
        const subscriptions = JSON.parse(localStorage.getItem('subscriptions')) || [];
        const newSubscription = {
            id: Date.now(),
            usuario_id: currentUser.id,
            plano_id: selectedPlan.id,
            data_inicio: new Date().toISOString(),
            data_fim: calculateSubscriptionEndDate(selectedPlan.period),
            status_pagamento: 'ativo',
            valor_pago: selectedPlan.finalPrice,
            periodo: selectedPlan.period
        };
        
        subscriptions.push(newSubscription);
        localStorage.setItem('subscriptions', JSON.stringify(subscriptions));
        
        // Show success message
        showPaymentSuccess();
        
    } catch (error) {
        showPaymentError();
    }
}

function calculateSubscriptionEndDate(period) {
    const now = new Date();
    if (period === 'yearly') {
        now.setFullYear(now.getFullYear() + 1);
    } else {
        now.setMonth(now.getMonth() + 1);
    }
    return now.toISOString();
}

function showPaymentSuccess() {
    closeModal('payment-modal');
    
    showMessage(`Parabéns! Você agora tem o plano ${selectedPlan.nome}! Redirecionando para o catálogo...`, 'success');
    
    // Redirect to catalog after 3 seconds
    setTimeout(() => {
        window.location.href = 'index.html#catalog';
    }, 3000);
}

function showPaymentError() {
    const completeBtn = document.getElementById('complete-payment');
    completeBtn.disabled = false;
    completeBtn.innerHTML = 'Finalizar Pagamento';
    
    showMessage('Erro ao processar pagamento. Tente novamente.', 'error');
}

// FAQ functionality
function toggleFAQ(element) {
    const faqItem = element.parentElement;
    const isActive = faqItem.classList.contains('active');
    
    // Close all FAQ items
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Open clicked item if it wasn't active
    if (!isActive) {
        faqItem.classList.add('active');
    }
}

// Utility functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Plan comparison functionality
function comparePlans() {
    const features = [
        'Qualidade de vídeo',
        'Telas simultâneas',
        'Catálogo completo',
        'Sem anúncios',
        'Download offline',
        'Conteúdo exclusivo'
    ];
    
    const planFeatures = {
        'basico': ['HD', '1', '✓', '✓', '✗', '✗'],
        'padrao': ['Full HD', '2', '✓', '✓', '✓', '✗'],
        'premium': ['4K Ultra HD', '4', '✓', '✓', '✓', '✓']
    };
    
    console.log('Comparação de Planos:', {
        features,
        planFeatures
    });
}

// Analytics tracking (simplified)
function trackPlanSelection(planType, period) {
    const event = {
        type: 'plan_selected',
        plan: planType,
        period: period,
        timestamp: new Date().toISOString(),
        user_id: currentUser?.id || 'anonymous'
    };
    
    // In a real application, this would send to analytics service
    console.log('Analytics Event:', event);
}

function trackPaymentAttempt(method, success) {
    const event = {
        type: 'payment_attempt',
        method: method,
        success: success,
        plan: selectedPlan?.nome || 'unknown',
        timestamp: new Date().toISOString(),
        user_id: currentUser?.id || 'anonymous'
    };
    
    console.log('Payment Analytics:', event);
}

// Promotional features
function applyPromoCode() {
    const promoCode = prompt('Digite o código promocional:');
    
    if (!promoCode) return;
    
    // Simplified promo code system
    const promoCodes = {
        'WELCOME20': { discount: 0.2, description: '20% de desconto' },
        'STUDENT15': { discount: 0.15, description: '15% de desconto para estudantes' },
        'FIRST30': { discount: 0.3, description: '30% de desconto no primeiro mês' }
    };
    
    const promo = promoCodes[promoCode.toUpperCase()];
    
    if (promo) {
        showMessage(`Código promocional aplicado! ${promo.description}`, 'success');
        // Apply discount logic here
    } else {
        showMessage('Código promocional inválido.', 'error');
    }
}

// Gift subscription functionality
function giftSubscription(planType) {
    if (!isLoggedIn) {
        showMessage('Faça login para presentear uma assinatura!', 'error');
        showLoginModal();
        return;
    }
    
    const recipientEmail = prompt('Email da pessoa que receberá o presente:');
    
    if (recipientEmail && isValidEmail(recipientEmail)) {
        showMessage(`Presente de assinatura ${planType} enviado para ${recipientEmail}!`, 'success');
        // In a real application, this would send an email
    } else {
        showMessage('Email inválido.', 'error');
    }
}

// Initialize page-specific functionality
document.addEventListener('DOMContentLoaded', function() {
    // Set up smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add loading states to buttons
    document.querySelectorAll('.btn-plan').forEach(button => {
        button.addEventListener('click', function() {
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
});
