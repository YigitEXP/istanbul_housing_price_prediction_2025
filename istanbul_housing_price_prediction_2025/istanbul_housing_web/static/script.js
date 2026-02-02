fetch('/get_districts')
    .then(response => response.json())
    .then(districts => {
        const districtSelect = document.getElementById('district');
        districts.forEach(district => {
            const option = document.createElement('option');
            option.value = district;
            option.textContent = district.charAt(0).toUpperCase() + district.slice(1);
            districtSelect.appendChild(option);
        });
    })
    .catch(error => console.error('Error loading districts:', error));

document.getElementById('predictionForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        total_squaremeter: document.getElementById('total_squaremeter').value,
        room: document.querySelector('input[name="room"]:checked').value,
        living_room: document.querySelector('input[name="living_room"]:checked').value,
        bath: document.querySelector('input[name="bath"]:checked').value,
        balcony: document.querySelector('input[name="balcony"]:checked').value,
        district: document.getElementById('district').value
    };

    try {
        const response = await fetch('/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();
        
        if (result.success) {
            const resultContainer = document.getElementById('predictionResult');
            const initialPrediction = resultContainer.querySelector('.prediction-initial');
            if (initialPrediction) {
                initialPrediction.remove();
            }
            resultContainer.innerHTML = `
                <div class="alert alert-success">
                    <h4 class="mb-1">Evinizin tahmini değeri: ${result.prediction}</h4>
                    <p class="mb-0">Bu tahmin yaklaşık bir değerdir.</p>
                </div>
            `;
        } else {
            resultContainer.innerHTML = `
                <div class="alert alert-danger">
                    <h4 class="mb-1">Hata: ${result.error}</h4>
                </div>
            `;
        }

    } finally {
        submitButton.disabled = false;
        submitButton.innerHTML = 'Tahmin Et';
        loadingContainer.style.display = 'none';
    }
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
});
