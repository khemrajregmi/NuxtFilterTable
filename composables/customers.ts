import { useMessage } from "naive-ui";
import { axiosInstance } from "~/main";

type GetCustomersProps = {
    page?: number;
    pageSize?: number,
    filters?: {
        name?: string | null
        email?: string | null
        status?: string | null
    }
}

export interface Customer {
    _id: string
    name: string
    email: string
    phone: string
    address: string
    status: string
    updated_at: string
    created_at: string
}

export interface CustomersData {
    current_page: number
    data: Customer[]
    first_page_url: string
    from: number
    last_page: number
    last_page_url: string
    next_page_url: string
    path: string
    per_page: number
    prev_page_url: any
    to: number
    total: number
}

export const useCustomers = () => {
    const message = useMessage()

    const customers = useState<CustomersData>('customers')
    const areCustomersLoading = useState<boolean>('customers_loading', () => false)

    async function getCustomers({ page, pageSize, filters }: GetCustomersProps) {
        try {
            areCustomersLoading.value = true
            const customersRes = await axiosInstance.get('/customers', {
                params: {
                    'page': page,
                    'page_size': pageSize,
                    ...(filters?.name ? { name: filters.name } : {}),
                    ...(filters?.email ? { email: filters.email } : {}),
                    ...(filters?.status ? { status: filters.status } : {}),
                }
            })

            customers.value = customersRes.data as CustomersData
        } catch (error: any) {
            message.error("An error occurred: " + error.message)
        } finally {
            areCustomersLoading.value = false
        }
    }

    return {
        customers,
        areCustomersLoading,
        getCustomers
    }
}
