package com.devconnect.models

import androidx.room.Entity
import androidx.room.PrimaryKey
import androidx.room.TypeConverters
import com.devconnect.database.Converters

@Entity(tableName = "projects")
@TypeConverters(Converters::class)
data class Project(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val title: String,
    val description: String,
    val imageUrl: String? = null,
    val repositoryUrl: String? = null,
    val demoUrl: String? = null,
    val technologies: List<String> = emptyList(),
    val authorId: Long,
    val authorName: String,
    val authorImageUrl: String? = null,
    val createdAt: Long = System.currentTimeMillis(),
    val updatedAt: Long = System.currentTimeMillis(),
    val likeCount: Int = 0,
    val shareCount: Int = 0,
    val viewCount: Int = 0,
    val isLiked: Boolean = false,
    val isPremiumContent: Boolean = false
) {
    fun getFormattedDate(): String {
        val now = System.currentTimeMillis()
        val diff = now - createdAt
        
        return when {
            diff < 60_000 -> "Agora"
            diff < 3600_000 -> "${diff / 60_000} min atrás"
            diff < 86400_000 -> "${diff / 3600_000}h atrás"
            diff < 604800_000 -> "${diff / 86400_000} dias atrás"
            else -> "${diff / 604800_000} semanas atrás"
        }
    }
}