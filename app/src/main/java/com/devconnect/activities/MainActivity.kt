package com.devconnect.activities

import android.content.Intent
import android.os.Bundle
import android.view.View
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import com.devconnect.adapters.ProjectAdapter
import com.devconnect.databinding.ActivityMainBinding
import com.devconnect.managers.AuthManager
import com.devconnect.managers.ProjectManager
import com.devconnect.models.Project
import com.google.android.material.tabs.TabLayout
import kotlinx.coroutines.launch

class MainActivity : AppCompatActivity() {
    
    private lateinit var binding: ActivityMainBinding
    private lateinit var authManager: AuthManager
    private lateinit var projectManager: ProjectManager
    private lateinit var projectAdapter: ProjectAdapter
    private var currentTab = 0 // 0 = Recent, 1 = Popular
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        authManager = AuthManager(this)
        projectManager = ProjectManager(this)
        
        setupRecyclerView()
        setupClickListeners()
        setupTabLayout()
        loadProjects()
    }
    
    private fun setupRecyclerView() {
        projectAdapter = ProjectAdapter { project ->
            // Handle project click
            openProjectDetails(project)
        }
        
        binding.recyclerViewProjects.apply {
            layoutManager = LinearLayoutManager(this@MainActivity)
            adapter = projectAdapter
        }
    }
    
    private fun setupClickListeners() {
        binding.btnNewProject.setOnClickListener {
            openCreateProject()
        }
        
        binding.btnCreateProject.setOnClickListener {
            openCreateProject()
        }
        
        binding.fabNewProject.setOnClickListener {
            openCreateProject()
        }
        
        binding.ivProfile.setOnClickListener {
            // Open profile or premium screen
            startActivity(Intent(this, PremiumActivity::class.java))
        }
    }
    
    private fun setupTabLayout() {
        binding.tabLayout.addOnTabSelectedListener(object : TabLayout.OnTabSelectedListener {
            override fun onTabSelected(tab: TabLayout.Tab?) {
                currentTab = tab?.position ?: 0
                loadProjects()
            }
            
            override fun onTabUnselected(tab: TabLayout.Tab?) {}
            override fun onTabReselected(tab: TabLayout.Tab?) {}
        })
    }
    
    private fun loadProjects() {
        lifecycleScope.launch {
            try {
                val projects = when (currentTab) {
                    0 -> projectManager.getRecentProjects()
                    1 -> projectManager.getPopularProjects()
                    else -> emptyList()
                }
                
                updateUI(projects)
            } catch (e: Exception) {
                // Handle error
                updateUI(emptyList())
            }
        }
    }
    
    private fun updateUI(projects: List<Project>) {
        if (projects.isEmpty()) {
            binding.emptyState.visibility = View.VISIBLE
            binding.recyclerViewProjects.visibility = View.GONE
            binding.fabNewProject.visibility = View.GONE
        } else {
            binding.emptyState.visibility = View.GONE
            binding.recyclerViewProjects.visibility = View.VISIBLE
            binding.fabNewProject.visibility = View.VISIBLE
            projectAdapter.updateProjects(projects)
        }
    }
    
    private fun openCreateProject() {
        // Check if user is premium for unlimited projects
        if (!authManager.isPremiumUser() && projectManager.getUserProjectCount() >= 3) {
            // Show premium upgrade dialog
            startActivity(Intent(this, PremiumActivity::class.java))
        } else {
            startActivity(Intent(this, CreateProjectActivity::class.java))
        }
    }
    
    private fun openProjectDetails(project: Project) {
        // TODO: Implement project details screen
        // For now, just show a toast or open external links
    }
    
    override fun onResume() {
        super.onResume()
        loadProjects() // Refresh projects when returning to this screen
    }
}