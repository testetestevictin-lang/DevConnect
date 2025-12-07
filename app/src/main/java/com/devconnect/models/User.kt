package com.devconnect.models

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "users")
data class User(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val username: String,
    val fullName: String?,
    val email: String,
    val passwordHash: String,
    val isPremium: Boolean = false,
    val premiumExpiryDate: Long? = null,
    val profileImageUrl: String? = null,
    val bio: String? = null,
    val createdAt: Long = System.currentTimeMillis(),
    val updatedAt: Long = System.currentTimeMillis()
)