'use client'

import React, { useState } from 'react';

import toast, { Toaster } from 'react-hot-toast';

// Firebase imports
import { db } from "../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function SectionContact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    message: "",
  });
  const [touched, setTouched] = useState({ 
    name: false, 
    email: false, 
    phoneNumber: false, 
    message: false 
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
    
    // Mark field as touched when it has any value (including autofill)
    if ((name === 'name' || name === 'email' || name === 'phoneNumber' || name === 'message') && value.trim().length > 0) {
      setTouched(prev => ({ ...prev, [name]: true }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {

      // Validate required fields
      if (!isFormValid) {
        toast.error("Please fill in the required fields.");
        setIsSubmitting(false);
        return;
      }

      // Save to Firebase
      const contactData = {
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        message: formData.message,
        timestamp: serverTimestamp(),
      };
      await addDoc(collection(db, "Contact"), contactData);
      toast.success("Message sent successfully! We'll get back to you soon.");
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        phoneNumber: "",
        message: "",
      });
      setTouched({ name: false, email: false, phoneNumber: false, message: false });
      setShowErrors(false);
      
    } catch (error) {
      console.error("Submission Error: ", error);
      toast.error("Error sending message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Validation Logic
  const isNameValid = formData.name.trim().length > 0;
  const isEmailValid = /\S+@\S+\.\S+/.test(formData.email);
  const isPhoneValid = formData.phoneNumber.trim().length > 9 && !/[a-zA-Z]/.test(formData.phoneNumber);
  const isMessageValid = formData.message.trim().length > 10; // Minimum 10 characters for message
  const isFormValid = isNameValid && isEmailValid && isPhoneValid && isMessageValid;
  
  // Helper functions for consistent error display (hide errors for focused field)
  const shouldShowNameError = focusedField !== 'name' && (showErrors || (touched.name && formData.name.trim().length > 0)) && !isNameValid;
  const shouldShowEmailError = focusedField !== 'email' && (showErrors || (touched.email && formData.email.trim().length > 0)) && !isEmailValid;
  const shouldShowPhoneError = focusedField !== 'phoneNumber' && (showErrors || (touched.phoneNumber && formData.phoneNumber.trim().length > 0)) && !isPhoneValid;
  const shouldShowMessageError = focusedField !== 'message' && (showErrors || (touched.message && formData.message.trim().length > 0)) && !isMessageValid;
  
  // Error Messages
  const nameError = shouldShowNameError ? 'Please enter your name.' : '';
  const emailError = shouldShowEmailError ? 'Please enter a valid email address.' : '';
  const phoneError = shouldShowPhoneError ? 'Please enter a valid phone number.' : '';
  const messageError = shouldShowMessageError ? 'Please enter a message.' : '';

  // Handle Disabled Button Click
  const handleDisabledButtonClick = () => {
    // Mark all fields as touched AND enable error display
    setTouched({
      name: true,
      email: true,
      phoneNumber: true,
      message: true
    });
    setShowErrors(true);
  };

  return (
    <div className="bg-[#000000]/50">
      <Toaster position="top-center" />
      <div className="max-w-[90vw] lg:max-w-[80vw] mx-auto py-16 lg:py-32">

        {/* Contact Form */}
        <div className="max-w-2xl mx-auto p-4 lg:p-8 bg-[#FFFFFF] rounded-lg lg:rounded-xl shadow-lg">
          <h2 className="mb-4 font-bold tracking-tight text-lg lg:text-xl text-[#101828]">
            Contact Us
          </h2>
          <hr className="mb-4 border-t-2 border-[#C39533]" />
          <p className="mb-6 text-md lg:text-lg text-[#101828]">
            Have a question or need assistance? Send us a message and we'll get back to you as soon as possible.
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

            {/* Email */}
            <div className="">
              <div className="flex items-center justify-between mb-1 lg:mb-2">
                <h3 className="text-md lg:text-lg text-[#4A5565]">
                  Email address: <span className="text-red-500">*</span>
                </h3>
                { emailError && (
                  <div role="alert" className="text-sm lg:text-md text-red-500">{emailError}</div>
                )}
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                onFocus={() => setFocusedField('email')}
                onBlur={() => {
                  setTouched(t => ({ ...t, email: true }));
                  setFocusedField(null);
                }}
                className={`h-10 lg:h-12 w-full px-1.5 lg:px-2 text-md lg:text-lg text-[#101828] rounded-md lg:rounded-lg border-2 focus:outline-none ${
                  touched.email && isEmailValid 
                    ? 'border-[#C39533]' 
                    : shouldShowEmailError 
                      ? 'border-red-500' 
                      : 'border-[#AAAAAA] focus:border-[#C39533]'
                }`}
                placeholder="Enter your email address"
              />
            </div>

            {/* Phone Number */}
            <div className="">
              <div className="flex items-center justify-between mb-1 lg:mb-2">
                <h3 className="text-md lg:text-lg text-[#4A5565]">
                  Phone Number: <span className="text-red-500">*</span>
                </h3>
                { phoneError && (
                  <div role="alert" className="text-sm lg:text-md text-red-500">{phoneError}</div>
                )}
              </div>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                autoComplete="tel"
                required
                value={formData.phoneNumber}
                onChange={handleChange}
                onFocus={() => setFocusedField('phoneNumber')}
                onBlur={() => {
                  setTouched(t => ({ ...t, phoneNumber: true }));
                  setFocusedField(null);
                }}
                className={`h-10 lg:h-12 w-full px-1.5 lg:px-2 text-md lg:text-lg text-[#101828] rounded-md lg:rounded-lg border-2 focus:outline-none ${
                  touched.phoneNumber && isPhoneValid 
                    ? 'border-[#C39533]' 
                    : shouldShowPhoneError 
                      ? 'border-red-500' 
                      : 'border-[#AAAAAA] focus:border-[#C39533]'
                }`}
                placeholder="Enter your phone number"
              />
            </div>

            {/* Message */}
            <div className="">
              <div className="flex items-center justify-between mb-1 lg:mb-2">
                <h3 className="text-md lg:text-lg text-[#4A5565]">
                  Message: <span className="text-red-500">*</span>
                </h3>
                { messageError && (
                  <div role="alert" className="text-sm lg:text-md text-red-500">{messageError}</div>
                )}
              </div>
              <textarea
                id="message"
                name="message"
                required
                rows={3}
                value={formData.message}
                onChange={handleChange}
                onFocus={() => setFocusedField('message')}
                onBlur={() => {
                  setTouched(t => ({ ...t, message: true }));
                  setFocusedField(null);
                }}
                className={`w-full -mb-2 px-1.5 lg:px-2 py-1 lg:py-2 text-md lg:text-lg text-[#101828] rounded-md lg:rounded-lg border-2 focus:outline-none resize-vertical ${
                  touched.message && isMessageValid 
                    ? 'border-[#C39533]' 
                    : shouldShowMessageError 
                      ? 'border-red-500' 
                      : 'border-[#AAAAAA] focus:border-[#C39533]'
                }`}
                placeholder="Enter your message here (minimum 10 characters)"
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
              {isSubmitting ? 'Sending Message...' : 'Send Message'}
            </button>
            
          </form>
        </div>

      </div>
    </div>
  );
}