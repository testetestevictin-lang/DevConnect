package com.devconnect.adapters

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.devconnect.databinding.ItemSelectedTechBinding

class SelectedTechAdapter(
    private val technologies: MutableList<String>,
    private val onRemoveClick: (String) -> Unit
) : RecyclerView.Adapter<SelectedTechAdapter.SelectedTechViewHolder>() {
    
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): SelectedTechViewHolder {
        val binding = ItemSelectedTechBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return SelectedTechViewHolder(binding)
    }
    
    override fun onBindViewHolder(holder: SelectedTechViewHolder, position: Int) {
        holder.bind(technologies[position])
    }
    
    override fun getItemCount(): Int = technologies.size
    
    inner class SelectedTechViewHolder(private val binding: ItemSelectedTechBinding) : RecyclerView.ViewHolder(binding.root) {
        
        fun bind(technology: String) {
            binding.apply {
                tvTechName.text = technology
                
                ivRemove.setOnClickListener {
                    onRemoveClick(technology)
                }
            }
        }
    }
}