#![no_std]
use soroban_sdk::{contract, contractimpl, Env, Address, String};

#[contract]
pub struct LumenGuildContract;

#[contractimpl]
impl LumenGuildContract {
    pub fn initialize(env: Env, admin: Address, name: String) {
        env.storage().instance().set(&"admin", &admin);
        env.storage().instance().set(&"name", &name);
    }

    pub fn get_name(env: Env) -> String {
        env.storage().instance().get(&"name").unwrap_or(String::from_str(&env, "Unknown"))
    }
}
