---
title: "Disease Detection Web Application"
category: "Computer Vision"
url: "https://github.com/ajeetkbhardwaj/Covid-19-Detection-Web-Application"
tags: ["computer-vision", "machine-learning", "flask"]
excerpt: "ML-powered platform using CNNs on chest X-rays for early detection of diseases, including COVID-19, built with Python, Flask, and JavaScript."
---

## Overview

A web application that screens chest X-ray images for signs of disease, with a focus on COVID-19 detection. The backend runs a convolutional neural network (CNN) that classifies X-ray images into healthy vs. diseased categories, exposed through a Flask API and a simple frontend for uploading and viewing results.

## What I built

- **CNN model:** trained a convolutional network on chest X-ray imagery to detect pathological patterns, including COVID-19 indicators.
- **Flask API:** served model predictions over REST endpoints, handling image upload, preprocessing, and inference.
- **Frontend:** a JavaScript frontend that lets users upload X-ray images and view the model's classification and confidence.
- **Deployment:** container-ready Python stack for straightforward deployment.

## Outcome

The system demonstrated that a lightweight CNN could flag abnormal X-rays with reasonable accuracy, offering a triage tool to prioritize cases for radiologist review. It was an early hands-on project in turning a trained model into a usable, web-facing application.
