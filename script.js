document.addEventListener("DOMContentLoaded", function () {
    // Hamburger Menu Toggle
    const hamburger = document.querySelector(".hamburger");
    if (hamburger) {
        hamburger.addEventListener("click", function () {
            var responsiveMenu = document.querySelector(".responsive-menu");
            responsiveMenu.classList.toggle("show");
        });
    }

    // Buttons to Redirect
    const buttons = document.querySelectorAll('.btn');
    if (buttons.length > 0) {
        buttons.forEach(button => {
            button.addEventListener('click', function() {
                alert("Redirecting to item details...");
            });
        });
    }

    // Firebase Configuration
    const firebaseConfig = {
        apiKey: "AIzaSyA7uvrwo0k8SirQD7n3p8kPN4ccDn5awDs",
        authDomain: "lewach-61752.firebaseapp.com",
        projectId: "lewach-61752",
        storageBucket: "lewach-61752.appspot.com",
        messagingSenderId: "549418727877",
        appId: "1:549418727877:web:cc97163b971deb74e3b3ac",
        measurementId: "G-E0ZSWHLM9W"
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();
    const database = firebase.database();

    // Elements
    const signupForm = document.getElementById('signup-form');
    const loginForm = document.getElementById('login-form');
    const postForm = document.getElementById('post-form');
    const messageDiv = document.getElementById('message');
    const postsContainer = document.getElementById('posts-container');
    const postsList = document.getElementById('posts-list');

    // Sign Up
    const signupBtn = document.getElementById('signup-btn');
    if (signupBtn) {
        signupBtn.addEventListener('click', () => {
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;

            auth.createUserWithEmailAndPassword(email, password)
                .then(userCredential => {
                    messageDiv.textContent = "Sign up successful. Please log in.";
                    messageDiv.style.color = "green";
                    setTimeout(() => {
                        window.location.href = 'login.html'; // Redirect to login after successful signup
                    }, 1000);
                })
                .catch(error => {
                    messageDiv.textContent = error.message;
                    messageDiv.style.color = "red";
                });
        });
    }

    // Login
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            auth.signInWithEmailAndPassword(email, password)
                .then(userCredential => {
                    messageDiv.textContent = "Login successful!";
                    messageDiv.style.color = "green";
                    setTimeout(() => {
                        window.location.href = 'index.html'; // Redirect to home or post page after successful login
                    }, 1000);
                })
                .catch(error => {
                    messageDiv.textContent = error.message;
                    messageDiv.style.color = "red";
                });
        });
    }

    // Post Content
    const postBtn = document.getElementById('post-btn');
    if (postBtn) {
        postBtn.addEventListener('click', () => {
            const user = auth.currentUser;
            const content = document.getElementById('post-content').value;

            if (user) {
                database.ref('posts/' + user.uid).push({
                    content: content,
                    timestamp: Date.now()
                }).then(() => {
                    messageDiv.textContent = "Post successful.";
                    messageDiv.style.color = "green";
                    document.getElementById('post-content').value = '';
                    displayPosts();
                }).catch(error => {
                    messageDiv.textContent = error.message;
                    messageDiv.style.color = "red";
                });
            } else {
                messageDiv.textContent = "You must be logged in to post.";
                messageDiv.style.color = "red";
            }
        });
    }

    // Display Posts
    function displayPosts() {
        const user = auth.currentUser;
        if (user && postsList) {
            database.ref('posts/' + user.uid).once('value', snapshot => {
                postsList.innerHTML = '';
                snapshot.forEach(childSnapshot => {
                    const post = childSnapshot.val();
                    const postElement = document.createElement('div');
                    postElement.textContent = post.content;
                    postsList.appendChild(postElement);
                });
            });
        }
    }
});
