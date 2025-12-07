package com.devconnect.activities

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import com.devconnect.R
import com.devconnect.adapters.TechSuggestionAdapter
import com.devconnect.adapters.SelectedTechAdapter
import com.devconnect.databinding.ActivityCreateProjectBinding
import com.devconnect.managers.ProjectManager
import com.devconnect.models.Project
import com.devconnect.utils.ValidationUtils
import kotlinx.coroutines.launch

class CreateProjectActivity : AppCompatActivity() {
    
    private lateinit var binding: ActivityCreateProjectBinding
    private lateinit var projectManager: ProjectManager
    private lateinit var techSuggestionAdapter: TechSuggestionAdapter
    private lateinit var selectedTechAdapter: SelectedTechAdapter
    
    private val selectedTechnologies = mutableListOf<String>()
    private val techSuggestions = listOf(
        "React", "TypeScript", "JavaScript", "Node.js", "Vue.js", "Angular",
        "Python", "Java", "Kotlin", "Swift", "Flutter", "React Native",
        "MongoDB", "PostgreSQL", "MySQL", "Firebase", "AWS", "Docker",
        "Kubernetes", "Git", "GraphQL", "REST API", "HTML", "CSS"
    )
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityCreateProjectBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        projectManager = ProjectManager(this)
        
        setupRecyclerViews()
        setupClickListeners()
    }
    
    private fun setupRecyclerViews() {
        // Tech suggestions
        techSuggestionAdapter = TechSuggestionAdapter(techSuggestions) { tech ->
            addTechnology(tech)
        }
        
        binding.recyclerViewSuggestions.apply {
            layoutManager = LinearLayoutManager(this@CreateProjectActivity, LinearLayoutManager.HORIZONTAL, false)
            adapter = techSuggestionAdapter
        }
        
        // Selected technologies
        selectedTechAdapter = SelectedTechAdapter(selectedTechnologies) { tech ->
            removeTechnology(tech)
        }
        
        binding.recyclerViewSelectedTechs.apply {
            layoutManager = LinearLayoutManager(this@CreateProjectActivity, LinearLayoutManager.HORIZONTAL, false)
            adapter = selectedTechAdapter
        }
    }
    
    private fun setupClickListeners() {
        binding.ivBack.setOnClickListener {
            finish()
        }
        
        binding.btnPublish.setOnClickListener {
            publishProject()
        }
        
        binding.tilTechnologies.setEndIconOnClickListener {
            val techName = binding.etTechnologies.text.toString().trim()
            if (techName.isNotEmpty()) {
                addTechnology(techName)
                binding.etTechnologies.text?.clear()
            }
        }
        
        binding.ivProfile.setOnClickListener {
            startActivity(Intent(this, PremiumActivity::class.java))
        }
    }
    
    private fun addTechnology(tech: String) {
        if (!selectedTechnologies.contains(tech)) {
            selectedTechnologies.add(tech)
            selectedTechAdapter.notifyItemInserted(selectedTechnologies.size - 1)
            updateTechSuggestions()
        }
    }
    
    private fun removeTechnology(tech: String) {
        val index = selectedTechnologies.indexOf(tech)
        if (index != -1) {
            selectedTechnologies.removeAt(index)
            selectedTechAdapter.notifyItemRemoved(index)
            updateTechSuggestions()
        }
    }
    
    private fun updateTechSuggestions() {
        val availableSuggestions = techSuggestions.filter { !selectedTechnologies.contains(it) }
        techSuggestionAdapter.updateSuggestions(availableSuggestions)
    }
    
    private fun publishProject() {
        val title = binding.etProjectTitle.text.toString().trim()
        val description = binding.etDescription.text.toString().trim()
        val imageUrl = binding.etImageUrl.text.toString().trim()
        val repositoryUrl = binding.etRepository.text.toString().trim()
        val demoUrl = binding.etDemoUrl.text.toString().trim()
        
        // Validate inputs
        if (!validateInputs(title, description)) {
            return
        }
        
        showLoading(true)
        
        lifecycleScope.launch {
            try {
                val project = Project(
                    id = 0, // Will be auto-generated
                    title = title,
                    description = description,
                    imageUrl = imageUrl.ifEmpty { null },
                    repositoryUrl = repositoryUrl.ifEmpty { null },
                    demoUrl = demoUrl.ifEmpty { null },
                    technologies = selectedTechnologies.toList(),
                    authorId = 1, // Current user ID
                    authorName = "Current User", // Get from AuthManager
                    createdAt = System.currentTimeMillis(),
                    likeCount = 0,
                    isLiked = false
                )
                
                val success = projectManager.createProject(project)
                
                if (success) {
                    Toast.makeText(this@CreateProjectActivity, getString(R.string.project_created_success), Toast.LENGTH_SHORT).show()
                    finish()
                } else {
                    Toast.makeText(this@CreateProjectActivity, "Erro ao criar projeto", Toast.LENGTH_SHORT).show()
                }
            } catch (e: Exception) {
                Toast.makeText(this@CreateProjectActivity, "Erro: ${e.message}", Toast.LENGTH_SHORT).show()
            } finally {
                showLoading(false)
            }
        }
    }
    
    private fun validateInputs(title: String, description: String): Boolean {
        var isValid = true
        
        // Validate title
        if (title.isEmpty()) {
            binding.tilProjectTitle.error = getString(R.string.field_required)
            isValid = false
        } else if (title.length < 3) {
            binding.tilProjectTitle.error = "Título deve ter pelo menos 3 caracteres"
            isValid = false
        } else {
            binding.tilProjectTitle.error = null
        }
        
        // Validate description
        if (description.isEmpty()) {
            binding.tilDescription.error = getString(R.string.field_required)
            isValid = false
        } else if (description.length < 10) {
            binding.tilDescription.error = "Descrição deve ter pelo menos 10 caracteres"
            isValid = false
        } else {
            binding.tilDescription.error = null
        }
        
        // Validate URLs if provided
        val imageUrl = binding.etImageUrl.text.toString().trim()
        if (imageUrl.isNotEmpty() && !ValidationUtils.isValidUrl(imageUrl)) {
            binding.tilImageUrl.error = "URL inválida"
            isValid = false
        } else {
            binding.tilImageUrl.error = null
        }
        
        val repositoryUrl = binding.etRepository.text.toString().trim()
        if (repositoryUrl.isNotEmpty() && !ValidationUtils.isValidUrl(repositoryUrl)) {
            binding.tilRepository.error = "URL inválida"
            isValid = false
        } else {
            binding.tilRepository.error = null
        }
        
        val demoUrl = binding.etDemoUrl.text.toString().trim()
        if (demoUrl.isNotEmpty() && !ValidationUtils.isValidUrl(demoUrl)) {
            binding.tilDemoUrl.error = "URL inválida"
            isValid = false
        } else {
            binding.tilDemoUrl.error = null
        }
        
        return isValid
    }
    
    private fun showLoading(show: Boolean) {
        binding.progressBar.visibility = if (show) View.VISIBLE else View.GONE
        binding.btnPublish.isEnabled = !show
    }
}