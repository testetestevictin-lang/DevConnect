package com.devconnect.activities

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.devconnect.R
import com.devconnect.databinding.ActivityRegisterBinding
import com.devconnect.managers.AuthManager
import com.devconnect.utils.ValidationUtils
import kotlinx.coroutines.launch

class RegisterActivity : AppCompatActivity() {
    
    private lateinit var binding: ActivityRegisterBinding
    private lateinit var authManager: AuthManager
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityRegisterBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        authManager = AuthManager(this)
        
        setupClickListeners()
    }
    
    private fun setupClickListeners() {
        binding.btnRegister.setOnClickListener {
            performRegister()
        }
        
        binding.tvLoginLink.setOnClickListener {
            finish() // Go back to login
        }
    }
    
    private fun performRegister() {
        val username = binding.etUsername.text.toString().trim()
        val fullName = binding.etFullName.text.toString().trim()
        val email = binding.etEmail.text.toString().trim()
        val password = binding.etPassword.text.toString().trim()
        
        // Validate inputs
        if (!validateInputs(username, email, password)) {
            return
        }
        
        showLoading(true)
        
        lifecycleScope.launch {
            try {
                val success = authManager.register(username, fullName, email, password)
                
                if (success) {
                    Toast.makeText(this@RegisterActivity, "Conta criada com sucesso!", Toast.LENGTH_SHORT).show()
                    startActivity(Intent(this@RegisterActivity, MainActivity::class.java))
                    finish()
                } else {
                    Toast.makeText(this@RegisterActivity, getString(R.string.register_failed), Toast.LENGTH_SHORT).show()
                }
            } catch (e: Exception) {
                Toast.makeText(this@RegisterActivity, "Erro: ${e.message}", Toast.LENGTH_SHORT).show()
            } finally {
                showLoading(false)
            }
        }
    }
    
    private fun validateInputs(username: String, email: String, password: String): Boolean {
        var isValid = true
        
        // Validate username
        if (username.isEmpty()) {
            binding.tilUsername.error = getString(R.string.field_required)
            isValid = false
        } else if (username.length < 3) {
            binding.tilUsername.error = getString(R.string.username_too_short)
            isValid = false
        } else {
            binding.tilUsername.error = null
        }
        
        // Validate email
        if (email.isEmpty()) {
            binding.tilEmail.error = getString(R.string.field_required)
            isValid = false
        } else if (!ValidationUtils.isValidEmail(email)) {
            binding.tilEmail.error = getString(R.string.invalid_email)
            isValid = false
        } else {
            binding.tilEmail.error = null
        }
        
        // Validate password
        if (password.isEmpty()) {
            binding.tilPassword.error = getString(R.string.field_required)
            isValid = false
        } else if (password.length < 6) {
            binding.tilPassword.error = getString(R.string.password_too_short)
            isValid = false
        } else {
            binding.tilPassword.error = null
        }
        
        return isValid
    }
    
    private fun showLoading(show: Boolean) {
        binding.progressBar.visibility = if (show) View.VISIBLE else View.GONE
        binding.btnRegister.isEnabled = !show
    }
}