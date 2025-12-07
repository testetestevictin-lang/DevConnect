package com.devconnect.managers

import android.content.Context
import com.devconnect.database.AppDatabase
import com.devconnect.models.Project
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class ProjectManager(private val context: Context) {
    
    private val database = AppDatabase.getDatabase(context)
    private val projectDao = database.projectDao()
    private val authManager = AuthManager(context)
    
    suspend fun getRecentProjects(): List<Project> = withContext(Dispatchers.IO) {
        return@withContext projectDao.getRecentProjects()
    }
    
    suspend fun getPopularProjects(): List<Project> = withContext(Dispatchers.IO) {
        return@withContext projectDao.getPopularProjects()
    }
    
    suspend fun createProject(project: Project): Boolean = withContext(Dispatchers.IO) {
        try {
            val currentUser = authManager.getCurrentUser()
            if (currentUser != null) {
                val projectWithAuthor = project.copy(
                    authorId = currentUser.id,
                    authorName = currentUser.username,
                    authorImageUrl = currentUser.profileImageUrl
                )
                
                val projectId = projectDao.insertProject(projectWithAuthor)
                return@withContext projectId > 0
            }
            return@withContext false
        } catch (e: Exception) {
            return@withContext false
        }
    }
    
    suspend fun getUserProjectCount(): Int = withContext(Dispatchers.IO) {
        val userId = authManager.getCurrentUserId()
        if (userId != -1L) {
            return@withContext projectDao.getProjectCountByAuthor(userId)
        }
        return@withContext 0
    }
    
    suspend fun getUserProjects(): List<Project> = withContext(Dispatchers.IO) {
        val userId = authManager.getCurrentUserId()
        if (userId != -1L) {
            return@withContext projectDao.getProjectsByAuthor(userId)
        }
        return@withContext emptyList()
    }
    
    suspend fun likeProject(projectId: Long): Boolean = withContext(Dispatchers.IO) {
        try {
            projectDao.incrementLikeCount(projectId)
            return@withContext true
        } catch (e: Exception) {
            return@withContext false
        }
    }
    
    suspend fun unlikeProject(projectId: Long): Boolean = withContext(Dispatchers.IO) {
        try {
            projectDao.decrementLikeCount(projectId)
            return@withContext true
        } catch (e: Exception) {
            return@withContext false
        }
    }
    
    suspend fun shareProject(projectId: Long): Boolean = withContext(Dispatchers.IO) {
        try {
            projectDao.incrementShareCount(projectId)
            return@withContext true
        } catch (e: Exception) {
            return@withContext false
        }
    }
    
    suspend fun viewProject(projectId: Long): Boolean = withContext(Dispatchers.IO) {
        try {
            projectDao.incrementViewCount(projectId)
            return@withContext true
        } catch (e: Exception) {
            return@withContext false
        }
    }
    
    suspend fun searchProjects(query: String): List<Project> = withContext(Dispatchers.IO) {
        return@withContext projectDao.searchProjects(query)
    }
    
    suspend fun deleteProject(projectId: Long): Boolean = withContext(Dispatchers.IO) {
        try {
            val project = projectDao.getProjectById(projectId)
            if (project != null && project.authorId == authManager.getCurrentUserId()) {
                projectDao.deleteProject(project)
                return@withContext true
            }
            return@withContext false
        } catch (e: Exception) {
            return@withContext false
        }
    }
}