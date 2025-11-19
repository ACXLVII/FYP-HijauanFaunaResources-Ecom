'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import toast, { Toaster } from 'react-hot-toast';

// Firebase imports
import { db } from "../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// Icon imports
import { FaStar } from 'react-icons/fa';
import { FaXmark } from 'react-icons/fa6';

export default function SectionReviewForm() {
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    description: "",
    rating: 0,
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [touched, setTouched] = useState({ 
    name: false, 
    date: false, 
    description: false,
    rating: false
  });
  const [focusedField, setFocusedField] = useState(null);
  const [showErrors, setShowErrors] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Mark field as touched when it has any value
    if ((name === 'name' || name === 'date' || name === 'description') && value.trim().length > 0) {
      setTouched(prev => ({ ...prev, [name]: true }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const maxImages = 5;
    const remainingSlots = maxImages - images.length;

    if (files.length > remainingSlots) {
      toast.error(`You can only upload up to ${maxImages} images. ${remainingSlots} slot(s) remaining.`);
      return;
    }

    files.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error(`${file.name} is too large. Maximum file size is 5MB.`);
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file.`);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setImages((prev) => [...prev, base64String]);
        setImagePreviews((prev) => [...prev, base64String]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRatingClick = (rating) => {
    setFormData((prev) => ({
      ...prev,
      rating: rating,
    }));
    setTouched(prev => ({ ...prev, rating: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!isFormValid) {
        toast.error("Please fill in all required fields.");
        setIsSubmitting(false);
        return;
      }

      // Save to Firebase
      const reviewData = {
        name: formData.name,
        date: formData.date,
        description: formData.description,
        rating: formData.rating,
        images: images,
        timestamp: serverTimestamp(),
      };
      await addDoc(collection(db, "Review"), reviewData);
      toast.success("Review submitted successfully! Thank you for your feedback.");
      
      // Reset form
      setFormData({
        name: "",
        date: "",
        description: "",
        rating: 0,
      });
      setImages([]);
      setImagePreviews([]);
      setTouched({ name: false, date: false, description: false, rating: false });
      setShowErrors(false);
      
    } catch (error) {
      console.error("Submission Error: ", error);
      toast.error("Error submitting review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Validation Logic
  const isNameValid = formData.name.trim().length > 0;
  const isDateValid = formData.date.trim().length > 0;
  const isDescriptionValid = formData.description.trim().length > 10; // Minimum 10 characters
  const isRatingValid = formData.rating > 0 && formData.rating <= 5;
  const isFormValid = isNameValid && isDateValid && isDescriptionValid && isRatingValid;
  
  // Helper functions for consistent error display
  const shouldShowNameError = focusedField !== 'name' && (showErrors || (touched.name && formData.name.trim().length > 0)) && !isNameValid;
  const shouldShowDateError = focusedField !== 'date' && (showErrors || (touched.date && formData.date.trim().length > 0)) && !isDateValid;
  const shouldShowDescriptionError = focusedField !== 'description' && (showErrors || (touched.description && formData.description.trim().length > 0)) && !isDescriptionValid;
  const shouldShowRatingError = (showErrors || touched.rating) && !isRatingValid;
  
  // Error Messages
  const nameError = shouldShowNameError ? 'Please enter your name.' : '';
  const dateError = shouldShowDateError ? 'Please select a date.' : '';
  const descriptionError = shouldShowDescriptionError ? 'Please enter a description (minimum 10 characters).' : '';
  const ratingError = shouldShowRatingError ? 'Please select a rating from 1 to 5 stars.' : '';

  // Handle Disabled Button Click
  const handleDisabledButtonClick = () => {
    setTouched({
      name: true,
      date: true,
      description: true,
      rating: true
    });
    setShowErrors(true);
  };

  // Get today's date in YYYY-MM-DD format for max date
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="bg-[#000000]/50">
      <Toaster position="top-center" />
      <div className="max-w-[90vw] lg:max-w-[80vw] mx-auto py-8 lg:py-16">

        {/* Review Form */}
        <div className="max-w-2xl mx-auto p-4 lg:p-8 bg-[#FFFFFF] rounded-lg lg:rounded-xl shadow-lg">
          <h2 className="mb-4 font-bold tracking-tight text-lg lg:text-xl text-[#101828]">
            Submit Your Review
          </h2>
          <hr className="mb-4 border-t-2 border-[#C39533]" />
          <p className="mb-6 text-md lg:text-lg text-[#101828]">
            We value your feedback. Please share your experience with us.
          </p>

          <form onSubmit={handleSubmit} className="space-y-2 lg:space-y-4">

            {/* Name */}
            <div className="">
              <div className="flex items-center justify-between mb-1 lg:mb-2">
                <h3 className="text-md lg:text-lg text-[#4A5565]">
                  Name: <span className="text-red-500">*</span>
                </h3>
                { nameError && (
                  <div role="alert" className="text-sm lg:text-md text-red-500">{nameError}</div>
                )}
              </div>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={formData.name}
                onChange={handleChange}
                onFocus={() => setFocusedField('name')}
                onBlur={() => {
                  setTouched(t => ({ ...t, name: true }));
                  setFocusedField(null);
                }}
                className={`h-10 lg:h-12 w-full px-1.5 lg:px-2 text-md lg:text-lg text-[#101828] rounded-md lg:rounded-lg border-2 focus:outline-none ${
                  touched.name && isNameValid 
                    ? 'border-[#C39533]' 
                    : shouldShowNameError 
                      ? 'border-red-500' 
                      : 'border-[#AAAAAA] focus:border-[#C39533]'
                }`}
                placeholder="Enter your full name"
              />
            </div>

            {/* Date */}
            <div className="">
              <div className="flex items-center justify-between mb-1 lg:mb-2">
                <h3 className="text-md lg:text-lg text-[#4A5565]">
                  Date: <span className="text-red-500">*</span>
                </h3>
                { dateError && (
                  <div role="alert" className="text-sm lg:text-md text-red-500">{dateError}</div>
                )}
              </div>
              <input
                id="date"
                name="date"
                type="date"
                required
                max={today}
                value={formData.date}
                onChange={handleChange}
                onFocus={() => setFocusedField('date')}
                onBlur={() => {
                  setTouched(t => ({ ...t, date: true }));
                  setFocusedField(null);
                }}
                className={`h-10 lg:h-12 w-full px-1.5 lg:px-2 text-md lg:text-lg text-[#101828] rounded-md lg:rounded-lg border-2 focus:outline-none ${
                  touched.date && isDateValid 
                    ? 'border-[#C39533]' 
                    : shouldShowDateError 
                      ? 'border-red-500' 
                      : 'border-[#AAAAAA] focus:border-[#C39533]'
                }`}
              />
            </div>

            {/* Star Rating */}
            <div className="">
              <div className="flex items-center justify-between mb-1 lg:mb-2">
                <h3 className="text-md lg:text-lg text-[#4A5565]">
                  Rating: <span className="text-red-500">*</span>
                </h3>
                { ratingError && (
                  <div role="alert" className="text-sm lg:text-md text-red-500">{ratingError}</div>
                )}
              </div>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingClick(star)}
                    className={`transition-transform hover:scale-110 active:scale-95 ${
                      star <= formData.rating
                        ? 'text-[#FFD700]'
                        : 'text-[#CCCCCC]'
                    }`}
                    aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                  >
                    <FaStar className="size-6 lg:size-8" />
                  </button>
                ))}
                {formData.rating > 0 && (
                  <span className="ml-2 text-md lg:text-lg text-[#4A5565]">
                    ({formData.rating} {formData.rating === 1 ? 'star' : 'stars'})
                  </span>
                )}
              </div>
            </div>

            {/* Images */}
            <div className="">
              <div className="flex items-center justify-between mb-1 lg:mb-2">
                <h3 className="text-md lg:text-lg text-[#4A5565]">
                  Pictures: <span className="text-gray-500">(Optional)</span>
                </h3>
                <span className="text-sm text-[#4A5565]">
                  {images.length}/5
                </span>
              </div>
              <input
                id="images"
                name="images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                disabled={images.length >= 5}
                className="h-10 lg:h-12 w-full px-1.5 lg:px-2 text-md lg:text-lg text-[#101828] rounded-md lg:rounded-lg border-2 border-[#AAAAAA] focus:outline-none focus:border-[#C39533] disabled:opacity-50 disabled:cursor-not-allowed"
              />
              {images.length >= 5 && (
                <p className="mt-1 text-sm text-[#4A5565]">
                  Maximum 5 images allowed.
                </p>
              )}
              
              {/* Image Previews */}
              {imagePreviews.length > 0 && (
                <div className="mt-4 grid grid-cols-2 lg:grid-cols-3 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-[#AAAAAA]">
                        <Image
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        aria-label="Remove image"
                      >
                        <FaXmark className="size-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="">
              <div className="flex items-center justify-between mb-1 lg:mb-2">
                <h3 className="text-md lg:text-lg text-[#4A5565]">
                  Description: <span className="text-red-500">*</span>
                </h3>
                { descriptionError && (
                  <div role="alert" className="text-sm lg:text-md text-red-500">{descriptionError}</div>
                )}
              </div>
              <textarea
                id="description"
                name="description"
                required
                rows={5}
                value={formData.description}
                onChange={handleChange}
                onFocus={() => setFocusedField('description')}
                onBlur={() => {
                  setTouched(t => ({ ...t, description: true }));
                  setFocusedField(null);
                }}
                className={`w-full px-1.5 lg:px-2 py-1 lg:py-2 text-md lg:text-lg text-[#101828] rounded-md lg:rounded-lg border-2 focus:outline-none resize-vertical ${
                  touched.description && isDescriptionValid 
                    ? 'border-[#C39533]' 
                    : shouldShowDescriptionError 
                      ? 'border-red-500' 
                      : 'border-[#AAAAAA] focus:border-[#C39533]'
                }`}
                placeholder="Share your experience and feedback (minimum 10 characters)"
              />
            </div>

            <p className="text-center text-sm lg:text-md text-[#4A5565]">
              <span className="text-red-500">*</span> Required fields
            </p>

            <button
              type="submit"
              onClick={!isFormValid ? handleDisabledButtonClick : undefined}
              className={`w-full p-2 lg:p-4 font-bold text-md lg:text-lg text-[#FFFFFF] rounded-md lg:rounded-lg shadow-lg transition ${
                !isFormValid || isSubmitting
                  ? 'bg-[#498118]/50 cursor-not-allowed' 
                  : 'bg-[#498118] cursor-pointer hover:scale-105 active:scale-95'
              }`}
              aria-disabled={!isFormValid || isSubmitting}
            >
              {isSubmitting ? 'Submitting Review...' : 'Submit Review'}
            </button>
            
          </form>
        </div>

      </div>
    </div>
  );
}

