package com.devconnect.adapters

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import androidx.recyclerview.widget.LinearLayoutManager
import com.devconnect.databinding.ItemProjectBinding
import com.devconnect.models.Project

class ProjectAdapter(
    private val onProjectClick: (Project) -> Unit
) : RecyclerView.Adapter<ProjectAdapter.ProjectViewHolder>() {
    
    private var projects = listOf<Project>()
    
    fun updateProjects(newProjects: List<Project>) {
        projects = newProjects
        notifyDataSetChanged()
    }
    
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ProjectViewHolder {
        val binding = ItemProjectBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return ProjectViewHolder(binding)
    }
    
    override fun onBindViewHolder(holder: ProjectViewHolder, position: Int) {
        holder.bind(projects[position])
    }
    
    override fun getItemCount(): Int = projects.size
    
    inner class ProjectViewHolder(private val binding: ItemProjectBinding) : RecyclerView.ViewHolder(binding.root) {
        
        private val techAdapter = TechTagAdapter()
        
        init {
            binding.recyclerViewTechs.apply {
                layoutManager = LinearLayoutManager(context, LinearLayoutManager.HORIZONTAL, false)
                adapter = techAdapter
            }
            
            binding.root.setOnClickListener {
                val position = adapterPosition
                if (position != RecyclerView.NO_POSITION) {
                    onProjectClick(projects[position])
                }
            }
        }
        
        fun bind(project: Project) {
            binding.apply {
                tvProjectTitle.text = project.title
                tvAuthor.text = "por @${project.authorName}"
                tvDescription.text = project.description
                tvLikeCount.text = project.likeCount.toString()
                tvDate.text = project.getFormattedDate()
                
                // Show premium badge if needed
                ivPremium.visibility = if (project.isPremiumContent) {
                    android.view.View.VISIBLE
                } else {
                    android.view.View.GONE
                }
                
                // Update technologies
                techAdapter.updateTechnologies(project.technologies)
                
                // Handle like button
                ivLike.setOnClickListener {
                    // TODO: Implement like functionality
                }
                
                // Handle share button
                ivShare.setOnClickListener {
                    // TODO: Implement share functionality
                }
            }
        }
    }
}