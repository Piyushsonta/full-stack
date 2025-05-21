import React from 'react';

const MealFilter = ({ filters, setFilters }) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="meal-filter card" data-aos="fade-up">
      <h3>Filter Meals</h3>
      
      <div className="filter-group">
        <label htmlFor="priceRange">Price Range:</label>
        <div className="price-range">
          <span>₹{filters.minPrice}</span>
          <input 
            type="range" 
            id="priceRange" 
            name="maxPrice"
            min={0} 
            max={100} 
            step={5}
            value={filters.maxPrice} 
            onChange={handleChange}
            className="form-control"
          />
          <span>₹{filters.maxPrice}</span>
        </div>
      </div>
      
      <div className="filter-group">
        <label htmlFor="cuisine">Cuisine Type:</label>
        <select 
          id="cuisine" 
          name="cuisine" 
          value={filters.cuisine} 
          onChange={handleChange}
          className="form-control"
        >
          <option value="">All Cuisines</option>
          <option value="italian">Italian</option>
          <option value="indian">Indian</option>
          <option value="mexican">Mexican</option>
          <option value="chinese">Chinese</option>
          <option value="japanese">Japanese</option>
          <option value="thai">Thai</option>
          <option value="mediterranean">Mediterranean</option>
          <option value="vegetarian">Vegetarian</option>
          <option value="american">American</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="sortBy">Sort By:</label>
        <select 
          id="sortBy" 
          name="sortBy" 
          value={filters.sortBy} 
          onChange={handleChange}
          className="form-control"
        >
          <option value="price">Price (Low to High)</option>
          <option value="-price">Price (High to Low)</option>
          <option value="date">Date (Newest First)</option>
        </select>
      </div>
      
      <div className="filter-group checkbox">
        <input 
          type="checkbox" 
          id="withAccommodation" 
          name="withAccommodation" 
          checked={filters.withAccommodation} 
          onChange={handleChange}
        />
        <label htmlFor="withAccommodation">With Accommodation</label>
      </div>

      <button 
        className="btn btn-register btn-block" 
        onClick={() => setFilters({
          minPrice: 0,
          maxPrice: 100,
          cuisine: '',
          sortBy: 'price',
          withAccommodation: false
        })}
      >
        Reset Filters
      </button>
    </div>
  );
};

export default MealFilter; 