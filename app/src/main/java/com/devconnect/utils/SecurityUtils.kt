package com.devconnect.utils

import java.security.MessageDigest
import java.security.SecureRandom
import java.util.Base64

object SecurityUtils {
    
    private const val SALT_LENGTH = 16
    
    fun hashPassword(password: String): String {
        val salt = generateSalt()
        val hash = hashPasswordWithSalt(password, salt)
        return "${Base64.getEncoder().encodeToString(salt)}:${Base64.getEncoder().encodeToString(hash)}"
    }
    
    fun verifyPassword(password: String, hashedPassword: String): Boolean {
        try {
            val parts = hashedPassword.split(":")
            if (parts.size != 2) return false
            
            val salt = Base64.getDecoder().decode(parts[0])
            val hash = Base64.getDecoder().decode(parts[1])
            
            val testHash = hashPasswordWithSalt(password, salt)
            return hash.contentEquals(testHash)
        } catch (e: Exception) {
            return false
        }
    }
    
    private fun generateSalt(): ByteArray {
        val random = SecureRandom()
        val salt = ByteArray(SALT_LENGTH)
        random.nextBytes(salt)
        return salt
    }
    
    private fun hashPasswordWithSalt(password: String, salt: ByteArray): ByteArray {
        val md = MessageDigest.getInstance("SHA-256")
        md.update(salt)
        return md.digest(password.toByteArray())
    }
    
    fun generateApiKey(): String {
        val random = SecureRandom()
        val bytes = ByteArray(32)
        random.nextBytes(bytes)
        return Base64.getEncoder().encodeToString(bytes)
    }
}