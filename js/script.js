document.addEventListener("DOMContentLoaded", function() {
    const collapsibles = document.querySelectorAll(".collapsible");
    
    collapsibles.forEach(button => {
        button.addEventListener("click", function() {
            this.classList.toggle("active");
            const content = this.nextElementSibling;
            
            if (content.style.display === "block") {
                content.style.display = "none";
            } else {
                content.style.display = "block";
            }
        });
    });

    const reviewForm = document.getElementById("review-form");
    const reviewsList = document.getElementById("reviews-list");
    const reviewPhoto = document.getElementById("review-photo");

    function loadReviews() {
        const savedReviews = JSON.parse(localStorage.getItem("reviews")) || [];
        savedReviews.forEach(review => addReviewToPage(review.username, review.text, review.photo));
    }

    function saveReview(username, text, photo) {
        const savedReviews = JSON.parse(localStorage.getItem("reviews")) || [];
        savedReviews.push({ username, text, photo });
        localStorage.setItem("reviews", JSON.stringify(savedReviews));
    }

    function addReviewToPage(username, text, photo) {
        const newReview = document.createElement("div");
        newReview.classList.add("review");
        newReview.innerHTML = `
            <p><strong>${username}:</strong> ${text}</p>
            ${photo ? `<img src="${photo}" alt="Фото відгуку" class="review-image">` : ""}
        `;
        reviewsList.appendChild(newReview);
    }

    reviewForm.addEventListener("submit", function(event) {
        event.preventDefault();
        
        const username = document.getElementById("username").value.trim();
        const reviewText = document.getElementById("review-text").value.trim();
        const photoFile = reviewPhoto.files[0];

        const nameRegex = /^[A-Za-zА-Яа-яЁёІіЇїЄєҐґ\s]+$/;

        if (!username || !reviewText) {
            alert("Будь ласка, заповніть всі поля!");
            return;
        }

        if (!nameRegex.test(username)) {
            alert("Ім'я може містити тільки букви!");
            return;
        }

        if (photoFile) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const photoData = e.target.result;
                addReviewToPage(username, reviewText, photoData);
                saveReview(username, reviewText, photoData);
            };
            reader.readAsDataURL(photoFile);
        } else {
            addReviewToPage(username, reviewText, null);
            saveReview(username, reviewText, null);
        }

        reviewForm.reset();
    });

    loadReviews();
});
