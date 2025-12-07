package com.devconnect.adapters

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.devconnect.databinding.ItemTechTagBinding

class TechSuggestionAdapter(
    private var suggestions: List<String>,
    private val onTechClick: (String) -> Unit
) : RecyclerView.Adapter<TechSuggestionAdapter.TechSuggestionViewHolder>() {
    
    fun updateSuggestions(newSuggestions: List<String>) {
        suggestions = newSuggestions
        notifyDataSetChanged()
    }
    
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): TechSuggestionViewHolder {
        val binding = ItemTechTagBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return TechSuggestionViewHolder(binding)
    }
    
    override fun onBindViewHolder(holder: TechSuggestionViewHolder, position: Int) {
        holder.bind(suggestions[position])
    }
    
    override fun getItemCount(): Int = suggestions.size
    
    inner class TechSuggestionViewHolder(private val binding: ItemTechTagBinding) : RecyclerView.ViewHolder(binding.root) {
        
        init {
            binding.root.setOnClickListener {
                val position = adapterPosition
                if (position != RecyclerView.NO_POSITION) {
                    onTechClick(suggestions[position])
                }
            }
        }
        
        fun bind(technology: String) {
            binding.tvTechName.text = technology
        }
    }
}