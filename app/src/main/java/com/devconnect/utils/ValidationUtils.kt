package com.devconnect.utils

import android.util.Patterns
import java.util.regex.Pattern

object ValidationUtils {
    
    fun isValidEmail(email: String): Boolean {
        return email.isNotEmpty() && Patterns.EMAIL_ADDRESS.matcher(email).matches()
    }
    
    fun isValidPassword(password: String): Boolean {
        return password.length >= 6
    }
    
    fun isValidUsername(username: String): Boolean {
        val pattern = Pattern.compile("^[a-zA-Z0-9_]{3,20}$")
        return pattern.matcher(username).matches()
    }
    
    fun isValidUrl(url: String): Boolean {
        return url.isNotEmpty() && Patterns.WEB_URL.matcher(url).matches()
    }
    
    fun isValidProjectTitle(title: String): Boolean {
        return title.trim().length in 3..100
    }
    
    fun isValidProjectDescription(description: String): Boolean {
        return description.trim().length in 10..1000
    }
    
    fun sanitizeInput(input: String): String {
        return input.trim()
            .replace("<", "&lt;")
            .replace(">", "&gt;")
            .replace("&", "&amp;")
            .replace("\"", "&quot;")
            .replace("'", "&#x27;")
    }
}