package com.devconnect.managers

import android.content.Context
import android.content.SharedPreferences
import com.devconnect.database.AppDatabase
import com.devconnect.models.User
import com.devconnect.utils.SecurityUtils
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class AuthManager(private val context: Context) {
    
    private val database = AppDatabase.getDatabase(context)
    private val userDao = database.userDao()
    private val prefs: SharedPreferences = context.getSharedPreferences("auth_prefs", Context.MODE_PRIVATE)
    
    companion object {
        private const val KEY_USER_ID = "user_id"
        private const val KEY_IS_LOGGED_IN = "is_logged_in"
        private const val KEY_IS_PREMIUM = "is_premium"
    }
    
    suspend fun login(email: String, password: String): Boolean = withContext(Dispatchers.IO) {
        try {
            val user = userDao.getUserByEmail(email)
            if (user != null && SecurityUtils.verifyPassword(password, user.passwordHash)) {
                saveUserSession(user)
                return@withContext true
            }
            return@withContext false
        } catch (e: Exception) {
            return@withContext false
        }
    }
    
    suspend fun register(username: String, fullName: String?, email: String, password: String): Boolean = withContext(Dispatchers.IO) {
        try {
            // Check if email or username already exists
            if (userDao.isEmailExists(email) > 0) {
                return@withContext false
            }
            
            if (userDao.isUsernameExists(username) > 0) {
                return@withContext false
            }
            
            val passwordHash = SecurityUtils.hashPassword(password)
            val user = User(
                username = username,
                fullName = fullName,
                email = email,
                passwordHash = passwordHash
            )
            
            val userId = userDao.insertUser(user)
            if (userId > 0) {
                val newUser = user.copy(id = userId)
                saveUserSession(newUser)
                return@withContext true
            }
            
            return@withContext false
        } catch (e: Exception) {
            return@withContext false
        }
    }
    
    fun logout() {
        prefs.edit().apply {
            clear()
            apply()
        }
    }
    
    fun isLoggedIn(): Boolean {
        return prefs.getBoolean(KEY_IS_LOGGED_IN, false)
    }
    
    fun getCurrentUserId(): Long {
        return prefs.getLong(KEY_USER_ID, -1)
    }
    
    suspend fun getCurrentUser(): User? = withContext(Dispatchers.IO) {
        val userId = getCurrentUserId()
        if (userId != -1L) {
            return@withContext userDao.getUserById(userId)
        }
        return@withContext null
    }
    
    fun isPremiumUser(): Boolean {
        return prefs.getBoolean(KEY_IS_PREMIUM, false)
    }
    
    suspend fun upgradeToPremium(): Boolean = withContext(Dispatchers.IO) {
        try {
            val user = getCurrentUser()
            if (user != null) {
                val premiumUser = user.copy(
                    isPremium = true,
                    premiumExpiryDate = System.currentTimeMillis() + (365L * 24 * 60 * 60 * 1000) // 1 year
                )
                userDao.updateUser(premiumUser)
                
                prefs.edit().apply {
                    putBoolean(KEY_IS_PREMIUM, true)
                    apply()
                }
                
                return@withContext true
            }
            return@withContext false
        } catch (e: Exception) {
            return@withContext false
        }
    }
    
    private fun saveUserSession(user: User) {
        prefs.edit().apply {
            putLong(KEY_USER_ID, user.id)
            putBoolean(KEY_IS_LOGGED_IN, true)
            putBoolean(KEY_IS_PREMIUM, user.isPremium)
            apply()
        }
    }
}