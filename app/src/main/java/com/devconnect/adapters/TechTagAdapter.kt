package com.devconnect.adapters

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.devconnect.databinding.ItemTechTagBinding

class TechTagAdapter : RecyclerView.Adapter<TechTagAdapter.TechTagViewHolder>() {
    
    private var technologies = listOf<String>()
    
    fun updateTechnologies(newTechnologies: List<String>) {
        technologies = newTechnologies
        notifyDataSetChanged()
    }
    
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): TechTagViewHolder {
        val binding = ItemTechTagBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return TechTagViewHolder(binding)
    }
    
    override fun onBindViewHolder(holder: TechTagViewHolder, position: Int) {
        holder.bind(technologies[position])
    }
    
    override fun getItemCount(): Int = technologies.size
    
    class TechTagViewHolder(private val binding: ItemTechTagBinding) : RecyclerView.ViewHolder(binding.root) {
        
        fun bind(technology: String) {
            binding.tvTechName.text = technology
        }
    }
}