import React, { useState } from 'react';
import './App.css';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import emailjs from 'emailjs-com';

// EmailJS IDs
const SERVICE_ID = 'service_nnshs7j';
const TEMPLATE_ID = 'template_e1wdkjg';
const USER_ID = 'HZlMyOBKB1sZrXPkK';

// Slider settings
const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 5000,
};

// Header component with Sign Up and Login buttons
function Header({ cartItemCount, onLoginClick, onSignUpClick, isSignedUp }) {
  return (
    <header className="header">
      <div className="logo">SleekSpace</div>
      <nav className="nav-menu">
        <a href="#home">Home</a>
        <a href="#products">Products</a>
        <a href="#reviews">Reviews</a>
        <a href="#help">Help</a>
        <button className="icon-button cart-button">
          <i className="fas fa-shopping-cart"></i>
          <span className="cart-count">{cartItemCount}</span>
        </button>
        {!isSignedUp && (
          <button className="icon-button sign-up-button" onClick={onSignUpClick}>
            <i className="fas fa-user-plus"></i>
          </button>
        )}
        <button className="icon-button login-button" onClick={onLoginClick}>
          <i className="fas fa-user"></i>
        </button>
      </nav>
    </header>
  );
}

// Rating component for reviews
function Rating({ rating, onRatingChange }) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="rating">
      {stars.map((star) => (
        <span
          key={star}
          className={`star ${star <= rating ? 'filled' : ''}`}
          onClick={() => onRatingChange(star)}
        >
          ★
        </span>
      ))}
    </div>
  );
}

// Review Submission component
function ReviewSubmission({ onSubmitReview }) {
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(0);

  const handleSubmit = () => {
    if (reviewRating === 0 || reviewText.trim() === '') {
      alert('Please provide a rating and a review.');
      return;
    }

    onSubmitReview({
      id: Math.random(),
      rating: reviewRating,
      comment: reviewText.trim(),
    });

    setReviewText('');
    setReviewRating(0);
  };

  return (
    <div className="review-submit-section">
      <h2>Submit Your Review</h2>
      <div className="rating-container">
        <Rating rating={reviewRating} onRatingChange={setReviewRating} />
      </div>
      <textarea
        className="review-textarea"
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        placeholder="Type your review here..."
      />
      <button className="submit-review-button" onClick={handleSubmit}>
        Submit Review
      </button>
    </div>
  );
}

// Search Bar component
function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleSearch = (event) => {
    setQuery(event.target.value);
    onSearch(event.target.value);
  };

  return (
    <div className="search-bar-container">
      <select
        value={query}
        onChange={handleSearch}
        className="search-bar"
      >
        <option value="">Search products...</option>
        <option value="Modern Cupboards">Modern Cupboards</option>
        <option value="Round Dining Tables">Round Dining Tables</option>
        <option value="Sofas and Decorative Accessories">Sofas and Decorative Accessories</option>
        <option value="Bed Frames and Pillows">Bed Frames and Pillows</option>
        <option value="Accent Chairs">Accent Chairs</option>
        <option value="Modern Office Desks">Modern Office Desks</option>
      </select>
    </div>
  );
}

function App() {
  const [products] = useState([
    { id: 1, name: 'Modern Cupboards', description: 'Elegant and functional designs for your home.', image: 'https://www.aertsen.in/wp-content/uploads/2022/12/Swing-Wardrobe-1024x691.jpg' },
    { id: 2, name: 'Round Dining Tables', description: 'Perfect for family gatherings and dinner parties.', image: 'https://i.pinimg.com/474x/87/1d/72/871d7296e3221f549bf0774a3d3533cd.jpg' },
    { id: 3, name: 'Sofas and Decorative Accessories', description: 'Add comfort and style to your living space.', image: 'https://m.media-amazon.com/images/I/81dM1ulRJXL._AC_UF894,1000_QL80_.jpg' },
    { id: 4, name: 'Bed Frames and Pillows', description: 'Sleep in luxury with our premium bed frames and pillows.', image: 'https://i.pinimg.com/736x/b2/c0/75/b2c0756ca9135679294df998947aef55.jpg' },
    { id: 5, name: 'Accent Chairs', description: 'Unique designs that add character to any room.', image: 'https://img.freepik.com/premium-photo/interior-home-room-with-round-chair-high-back-armrests_825692-10100.jpg' },
    { id: 6, name: 'Modern Office Desks', description: 'Custom-made Office Desks and Chairs', image: 'https://i.pinimg.com/originals/66/1b/3b/661b3be4490a87c533be6377ce1528a4.jpg' }
  ]);

  const [filteredProducts, setFilteredProducts] = useState(products);
  const [cartItems, setCartItems] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [customerReviews, setCustomerReviews] = useState([]);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [signUpForm, setSignUpForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [authError, setAuthError] = useState(''); // New state for authentication error
  const [isSignedUp, setIsSignedUp] = useState(false);

  const handleSearch = (query) => {
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const handleAddToCart = (product) => {
    setCartItems([...cartItems, product]);
  };

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  const handleSignUpClick = () => {
    setShowSignUpModal(true);
  };

  const handleLoginClose = () => {
    setShowLoginModal(false);
  };

  const handleSignUpClose = () => {
    setShowSignUpModal(false);
  };

  const handleReviewSubmit = (review) => {
    setCustomerReviews([...customerReviews, review]);
  };

  const handleLoginChange = (e) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };

  const handleSignUpChange = (e) => {
    setSignUpForm({ ...signUpForm, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    // Check if the provided username and password match the stored credentials in signUp
    if (loginForm.username === signUpForm.username && loginForm.password === signUpForm.password) {
      console.log('Login successful');
      setAuthError('');
      setShowLoginModal(false);
    } else {
      setAuthError('Authentication Failed, cannot Login');
    }
  };

  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    // Check if the passwords match
    if (signUpForm.password !== signUpForm.confirmPassword) {
      setAuthError('Passwords do not match');
      return;
    }

    // Send confirmation email using EmailJS
    const templateParams = {
      username: signUpForm.username,
      email: signUpForm.email,
      password: signUpForm.password,
    };

    emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, USER_ID)
      .then(response => {
        console.log('Email sent successfully:', response);
        setAuthError(''); 
        setIsSignedUp(true);
        setShowSignUpModal(false); 
      })
      .catch(error => {
        console.error('Error sending email:', error);
        setAuthError('Failed to send confirmation email');
      });
  };

  return (
    <div className="App">
      <Header
        cartItemCount={cartItems.length}
        onLoginClick={handleLoginClick}
        onSignUpClick={handleSignUpClick}
        isSignedUp={isSignedUp}
      />
      <div className="slideshow-container">
        <Slider {...sliderSettings}>
          {products.map((product) => (
            <div className="slide" key={product.id}>
              <img src={product.image} alt={product.name} />
              <p>{product.description}</p>
            </div>
          ))}
        </Slider>
      </div>
      <div id="products" className="product-section">
        <h1>Discover Modern Furniture</h1>
        <p>Expand your Horizons</p>
        <SearchBar onSearch={handleSearch} />
        <ul className="product-list">
          {filteredProducts.map((product) => (
            <li key={product.id} className="product-item">
              <h2>{product.name}</h2>
              <img src={product.image} alt={product.name} className="product-image"/>
              <p>{product.description}</p>
              <button
                className="add-to-cart-button"
                onClick={() => handleAddToCart(product)}
              >
                Add to Cart
              </button>
            </li>
          ))}
        </ul>
      </div>
      <ReviewSubmission onSubmitReview={handleReviewSubmit} />
      <div id="reviews" className="customer-reviews">
        <h2>What Our Customers Say</h2>
        <div className="reviews-grid">
          {customerReviews.map((review) => (
            <div key={review.id} className="review-item">
              <Rating rating={review.rating} />
              <p>{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
      <div id="help" className="help-section">
        <h2>Need Help?</h2>
        <button className="contact-button">Contact Us</button>
        <div className="contact-info">
          <p><strong>Customer Support:</strong> Discovermodernfurniture.com</p>
          <p><strong>Phone:</strong> +91 9381261436</p>
        </div>
      </div>
      {showLoginModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleLoginClose}>&times;</span>
            <h2>Login</h2>
            <form onSubmit={handleLoginSubmit}>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={loginForm.username}
                  onChange={handleLoginChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={loginForm.password}
                  onChange={handleLoginChange}
                  required
                />
              </div>
              {authError && <p className="auth-error">{authError}</p>} {/* Display authentication error */}
              <button type="submit">Login</button>
            </form>
          </div>
        </div>
      )}
      {showSignUpModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleSignUpClose}>&times;</span>
            <h2>Sign Up</h2>
            <form onSubmit={handleSignUpSubmit}>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={signUpForm.username}
                  onChange={handleSignUpChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={signUpForm.email}
                  onChange={handleSignUpChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={signUpForm.password}
                  onChange={handleSignUpChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={signUpForm.confirmPassword}
                  onChange={handleSignUpChange}
                  required
                />
              </div>
              {authError && <p className="auth-error">{authError}</p>} {/* Display sign-up error */}
              <button type="submit">Sign Up</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
