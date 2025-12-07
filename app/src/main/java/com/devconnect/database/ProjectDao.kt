package com.devconnect.database

import androidx.room.*
import com.devconnect.models.Project

@Dao
interface ProjectDao {
    
    @Query("SELECT * FROM projects ORDER BY createdAt DESC")
    suspend fun getAllProjects(): List<Project>
    
    @Query("SELECT * FROM projects ORDER BY createdAt DESC LIMIT :limit")
    suspend fun getRecentProjects(limit: Int = 20): List<Project>
    
    @Query("SELECT * FROM projects ORDER BY likeCount DESC, viewCount DESC LIMIT :limit")
    suspend fun getPopularProjects(limit: Int = 20): List<Project>
    
    @Query("SELECT * FROM projects WHERE authorId = :authorId ORDER BY createdAt DESC")
    suspend fun getProjectsByAuthor(authorId: Long): List<Project>
    
    @Query("SELECT * FROM projects WHERE id = :id LIMIT 1")
    suspend fun getProjectById(id: Long): Project?
    
    @Insert
    suspend fun insertProject(project: Project): Long
    
    @Update
    suspend fun updateProject(project: Project)
    
    @Delete
    suspend fun deleteProject(project: Project)
    
    @Query("UPDATE projects SET likeCount = likeCount + 1 WHERE id = :projectId")
    suspend fun incrementLikeCount(projectId: Long)
    
    @Query("UPDATE projects SET likeCount = likeCount - 1 WHERE id = :projectId")
    suspend fun decrementLikeCount(projectId: Long)
    
    @Query("UPDATE projects SET viewCount = viewCount + 1 WHERE id = :projectId")
    suspend fun incrementViewCount(projectId: Long)
    
    @Query("UPDATE projects SET shareCount = shareCount + 1 WHERE id = :projectId")
    suspend fun incrementShareCount(projectId: Long)
    
    @Query("SELECT COUNT(*) FROM projects WHERE authorId = :authorId")
    suspend fun getProjectCountByAuthor(authorId: Long): Int
    
    @Query("SELECT * FROM projects WHERE title LIKE '%' || :query || '%' OR description LIKE '%' || :query || '%' ORDER BY createdAt DESC")
    suspend fun searchProjects(query: String): List<Project>
}