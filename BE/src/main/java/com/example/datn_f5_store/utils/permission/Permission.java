package com.example.datn_f5_store.utils.permission;

public enum Permission {
    ADMIN_READ("admin"),
    USER_READ("user"),
    CUSTOMER_READ("customer");
    private final String permission;
    Permission(String permission){
        this.permission = permission;
    }
    public String getPermission(){
        return permission;
    }
}
