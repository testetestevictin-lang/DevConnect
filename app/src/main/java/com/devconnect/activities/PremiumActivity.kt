package com.devconnect.activities

import android.os.Bundle
import android.view.View
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.devconnect.R
import com.devconnect.databinding.ActivityPremiumBinding
import com.devconnect.managers.AuthManager
import kotlinx.coroutines.launch

class PremiumActivity : AppCompatActivity() {
    
    private lateinit var binding: ActivityPremiumBinding
    private lateinit var authManager: AuthManager
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityPremiumBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        authManager = AuthManager(this)
        
        setupClickListeners()
        checkPremiumStatus()
    }
    
    private fun setupClickListeners() {
        binding.ivClose.setOnClickListener {
            finish()
        }
        
        binding.btnSubscribe.setOnClickListener {
            subscribeToPremium()
        }
    }
    
    private fun checkPremiumStatus() {
        if (authManager.isPremiumUser()) {
            // User is already premium, show different UI
            binding.btnSubscribe.text = getString(R.string.already_premium)
            binding.btnSubscribe.isEnabled = false
        }
    }
    
    private fun subscribeToPremium() {
        showLoading(true)
        
        lifecycleScope.launch {
            try {
                // In a real app, this would integrate with Google Play Billing
                // For demo purposes, we'll just upgrade the user directly
                val success = authManager.upgradeToPremium()
                
                if (success) {
                    Toast.makeText(this@PremiumActivity, "Parabéns! Você agora é Premium!", Toast.LENGTH_LONG).show()
                    binding.btnSubscribe.text = getString(R.string.already_premium)
                    binding.btnSubscribe.isEnabled = false
                } else {
                    Toast.makeText(this@PremiumActivity, "Erro ao processar assinatura", Toast.LENGTH_SHORT).show()
                }
            } catch (e: Exception) {
                Toast.makeText(this@PremiumActivity, "Erro: ${e.message}", Toast.LENGTH_SHORT).show()
            } finally {
                showLoading(false)
            }
        }
    }
    
    private fun showLoading(show: Boolean) {
        binding.progressBar.visibility = if (show) View.VISIBLE else View.GONE
        binding.btnSubscribe.isEnabled = !show
    }
}