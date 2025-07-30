const API_BASE_URL = 'http://localhost:5000/api'

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`)
      }
      
      return data
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // Financial endpoints
  async getDashboard() {
    return this.request('/financial/dashboard')
  }

  async getTransactions(filters = {}) {
    const params = new URLSearchParams(filters)
    return this.request(`/financial/transactions?${params}`)
  }

  async createTransaction(transaction) {
    return this.request('/financial/transactions', {
      method: 'POST',
      body: JSON.stringify(transaction),
    })
  }

  async updateTransaction(id, transaction) {
    return this.request(`/financial/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(transaction),
    })
  }

  async deleteTransaction(id) {
    return this.request(`/financial/transactions/${id}`, {
      method: 'DELETE',
    })
  }

  async getCategories() {
    return this.request('/financial/categories')
  }

  async createCategory(category) {
    return this.request('/financial/categories', {
      method: 'POST',
      body: JSON.stringify(category),
    })
  }

  async getAccounts() {
    return this.request('/financial/accounts')
  }

  async createAccount(account) {
    return this.request('/financial/accounts', {
      method: 'POST',
      body: JSON.stringify(account),
    })
  }

  async getGoals() {
    return this.request('/financial/goals')
  }

  async createGoal(goal) {
    return this.request('/financial/goals', {
      method: 'POST',
      body: JSON.stringify(goal),
    })
  }

  async updateGoal(id, goal) {
    return this.request(`/financial/goals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(goal),
    })
  }

  async deleteGoal(id) {
    return this.request(`/financial/goals/${id}`, {
      method: 'DELETE',
    })
  }

  async getProjections(months = 3) {
    return this.request(`/financial/projections?months=${months}`)
  }

  async getSpendingLimits() {
    return this.request('/financial/spending-limits')
  }

  async createSpendingLimit(limit) {
    return this.request('/financial/spending-limits', {
      method: 'POST',
      body: JSON.stringify(limit),
    })
  }

  async updateSpendingLimit(id, limit) {
    return this.request(`/financial/spending-limits/${id}`, {
      method: 'PUT',
      body: JSON.stringify(limit),
    })
  }

  async deleteSpendingLimit(id) {
    return this.request(`/financial/spending-limits/${id}`, {
      method: 'DELETE',
    })
  }

  async importSampleData() {
    return this.request('/financial/import-sample-data', {
      method: 'POST',
    })
  }

  // Alerts endpoints
  async getAlerts(filters = {}) {
    const params = new URLSearchParams(filters)
    return this.request(`/alerts?${params}`)
  }

  async getAlertsummary() {
    return this.request('/alerts/summary')
  }

  async markAlertAsRead(alertIndex) {
    return this.request(`/alerts/${alertIndex}/mark-read`, {
      method: 'POST',
    })
  }

  async getAlertsByPriority(priority) {
    return this.request(`/alerts/priority/${priority}`)
  }

  async getAlertTypes() {
    return this.request('/alerts/types')
  }

  async generateTestAlerts() {
    return this.request('/alerts/test', {
      method: 'POST',
    })
  }

  // Import endpoints
  async validateImportFile(formData) {
    try {
      const response = await fetch(`${this.baseURL}/import/validate-file`, {
        method: 'POST',
        body: formData
      })
      return await response.json()
    } catch (error) {
      throw new Error(`Erro ao validar arquivo: ${error.message}`)
    }
  }

  async importTransactions(formData) {
    try {
      const response = await fetch(`${this.baseURL}/import/upload-transactions`, {
        method: 'POST',
        body: formData
      })
      return await response.json()
    } catch (error) {
      throw new Error(`Erro ao importar transações: ${error.message}`)
    }
  }

  async getImportTemplate() {
    try {
      const response = await fetch(`${this.baseURL}/import/template`)
      return await response.json()
    } catch (error) {
      throw new Error(`Erro ao obter template: ${error.message}`)
    }
  }
}

export default new ApiService()

