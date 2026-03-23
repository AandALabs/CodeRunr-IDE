export interface APIResponse<T> {
  status: string;
  message: string;
  data: T;
}

export interface Language {
  id: number;
  name: string;
  source_file?: string | null;
  compile_cmd?: string | null;
  run_cmd?: string | null;
}

export interface SubmissionCreate {
  source_code: string;
  language_id: number;
  stdin?: string | null;
  expected_output?: string | null;
  cpu_time_limit?: number;
  cpu_extra_time?: number;
  wall_time_limit?: number;
  memory_limit?: number;
  stack_limit?: number;
  max_file_size?: number;
  max_processes_and_or_threads?: number;
  limit_per_process_and_thread_cpu_time_usages?: boolean;
  limit_per_process_and_thread_memory_usages?: boolean;
  webhook_url?: string;
}

export interface SubmissionResponse {
  token: string;
  source_code: string;
  language_id: number;
  stdin?: string | null;
  expected_output?: string | null;
  stdout?: string | null;
  stderr?: string | null;
  compile_output?: string | null;
  message?: string | null;
  status: string;
  time?: number | null;
  wall_time?: number | null;
  memory?: number | null;
  exit_code?: number | null;
  exit_signal?: number | null;
  cpu_time_limit: number;
  cpu_extra_time: number;
  wall_time_limit: number;
  memory_limit: number;
  stack_limit: number;
  max_file_size: number;
  max_processes_and_or_threads: number;
  limit_per_process_and_thread_cpu_time_usages: boolean;
  limit_per_process_and_thread_memory_usages: boolean;
  webhook_url?: string;
  created_at?: string | null;
  finished_at?: string | null;
}
