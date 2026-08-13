/**
 * EPS 类型描述（自动生成，勿手改）
 * 重新生成：pnpm eps（请求后端 EPS，失败回退 build/cool/eps.json）
 */
declare namespace Eps {
	type json = any;

	interface PagePagination {
		size: number;
		page: number;
		total: number;
		[key: string]: any;
	}

	interface PageResponse<T> {
		pagination: PagePagination;
		list: T[];
		[key: string]: any;
	}

	interface RequestOptions {
		url: string;
		method?: "OPTIONS" | "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "TRACE" | "CONNECT";
		data?: any;
		params?: any;
		headers?: any;
		timeout?: number;
		[key: string]: any;
	}

	type Request = (options: RequestOptions) => Promise<any>;

		interface SysUserEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 部门ID
		 */
		departmentId?: number;

		/**
		 * 创建者ID
		 */
		userId?: number;

		/**
		 * 登录名
		 */
		username?: string;

		/**
		 * 密码(md5)
		 */
		password?: string;

		/**
		 * 密码版本
		 */
		passwordV?: number;

		/**
		 * 姓名
		 */
		name?: string;

		/**
		 * 昵称
		 */
		nickName?: string;

		/**
		 * 头像URL
		 */
		headImg?: string;

		/**
		 * 手机
		 */
		phone?: string;

		/**
		 * 邮箱
		 */
		email?: string;

		/**
		 * 备注
		 */
		remark?: string;

		/**
		 * 状态
		 */
		status?: number;

		/**
		 * WebSocket会话(一期留空)
		 */
		socketId?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface SysRoleEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 创建人ID
		 */
		userId?: number;

		/**
		 * 角色名称
		 */
		name?: string;

		/**
		 * 角色标签
		 */
		label?: string;

		/**
		 * 备注
		 */
		remark?: string;

		/**
		 * 数据权限是否关联上下级
		 */
		relevance?: number;

		/**
		 * 菜单权限
		 */
		menuIdList?: string;

		/**
		 * 部门权限
		 */
		departmentIdList?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface SysMenuEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 父菜单(顶级为 null)
		 */
		parentId?: number;

		/**
		 * 菜单名称
		 */
		name?: string;

		/**
		 * 路由地址
		 */
		router?: string;

		/**
		 * 权限标识
		 */
		perms?: string;

		/**
		 * 类型
		 */
		type?: number;

		/**
		 * 图标
		 */
		icon?: string;

		/**
		 * 排序
		 */
		orderNum?: number;

		/**
		 * 前端视图文件路径
		 */
		viewPath?: string;

		/**
		 * 路由缓存
		 */
		keepAlive?: number;

		/**
		 * 是否显示
		 */
		isShow?: number;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface SysDepartmentEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 父部门(顶级为 null)
		 */
		parentId?: number;

		/**
		 * 部门名称
		 */
		name?: string;

		/**
		 * 创建者ID
		 */
		userId?: number;

		/**
		 * 排序
		 */
		orderNum?: number;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface SysParamEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 键位
		 */
		keyName?: string;

		/**
		 * 名称
		 */
		name?: string;

		/**
		 * 数据内容
		 */
		data?: string;

		/**
		 * 数据类型
		 */
		dataType?: number;

		/**
		 * 备注
		 */
		remark?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface SysLogEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 用户ID
		 */
		userId?: number;

		/**
		 * 操作
		 */
		action?: string;

		/**
		 * IP
		 */
		ip?: string;

		/**
		 * IP归属地
		 */
		ipAddr?: string;

		/**
		 * 请求参数
		 */
		params?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface DemoGoodsEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 标题
		 */
		title?: string;

		/**
		 * 价格
		 */
		price?: number;

		/**
		 * 描述
		 */
		description?: string;

		/**
		 * 主图
		 */
		mainImage?: string;

		/**
		 * 分类
		 */
		type?: number;

		/**
		 * 状态
		 */
		status?: number;

		/**
		 * 示例图
		 */
		exampleImages?: string;

		/**
		 * 库存
		 */
		stock?: number;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface TaskInfoEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 任务ID
		 */
		jobId?: string;

		/**
		 * 任务配置
		 */
		repeatConf?: string;

		/**
		 * 名称
		 */
		name?: string;

		/**
		 * cron
		 */
		cron?: string;

		/**
		 * 最大执行次数 不传为无限次
		 */
		limit?: number;

		/**
		 * 每间隔多少毫秒执行一次 如果cron设置了 这项设置就无效
		 */
		every?: number;

		/**
		 * 备注
		 */
		remark?: string;

		/**
		 * 状态 0-停止 1-运行
		 */
		status?: number;

		/**
		 * 开始时间
		 */
		startDate?: string;

		/**
		 * 结束时间
		 */
		endDate?: string;

		/**
		 * 数据
		 */
		data?: string;

		/**
		 * 执行的service实例ID
		 */
		service?: string;

		/**
		 * 类型 0-系统 1-用户
		 */
		type?: number;

		/**
		 * 下一次执行时间
		 */
		nextRunTime?: string;

		/**
		 * 任务类型 0-cron 1-时间间隔
		 */
		taskType?: number;

		/**
		 * 
		 */
		lastExecuteTime?: string;

		/**
		 * 
		 */
		lockExpireTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface DictInfoEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 类型ID
		 */
		typeId?: string;

		/**
		 * 名称
		 */
		name?: string;

		/**
		 * 值
		 */
		value?: string;

		/**
		 * 排序
		 */
		orderNum?: string;

		/**
		 * 备注
		 */
		remark?: string;

		/**
		 * 父ID
		 */
		parentId?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface DictTypeEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 名称
		 */
		name?: string;

		/**
		 * 标识
		 */
		key?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface SpaceInfoEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 地址
		 */
		url?: string;

		/**
		 * 类型
		 */
		type?: string;

		/**
		 * 分类ID
		 */
		classifyId?: string;

		/**
		 * 文件id
		 */
		fileId?: string;

		/**
		 * 文件名
		 */
		name?: string;

		/**
		 * 文件大小
		 */
		size?: string;

		/**
		 * 文档版本
		 */
		version?: string;

		/**
		 * 文件位置
		 */
		key?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface SpaceTypeEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 类别名称
		 */
		name?: string;

		/**
		 * 父分类ID
		 */
		parentId?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface PluginInfoEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 名称
		 */
		name?: string;

		/**
		 * 简介
		 */
		description?: string;

		/**
		 * Key名
		 */
		keyName?: string;

		/**
		 * Hook
		 */
		hook?: string;

		/**
		 * 描述
		 */
		readme?: string;

		/**
		 * 版本
		 */
		version?: string;

		/**
		 * Logo(base64)
		 */
		logo?: string;

		/**
		 * 作者
		 */
		author?: string;

		/**
		 * 状态 0-禁用 1-启用
		 */
		status?: string;

		/**
		 * 内容
		 */
		content?: string;

		/**
		 * ts内容
		 */
		tsContent?: string;

		/**
		 * 插件的plugin.json
		 */
		pluginJson?: string;

		/**
		 * 配置
		 */
		config?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface UserInfoEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 登录唯一ID
		 */
		unionid?: string;

		/**
		 * 头像
		 */
		avatarUrl?: string;

		/**
		 * 昵称
		 */
		nickName?: string;

		/**
		 * 手机号
		 */
		phone?: string;

		/**
		 * 性别
		 */
		gender?: string;

		/**
		 * 状态
		 */
		status?: string;

		/**
		 * 登录方式
		 */
		loginType?: string;

		/**
		 * 密码
		 */
		password?: string;

		/**
		 * 介绍
		 */
		description?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface UserAddressEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 用户ID
		 */
		userId?: string;

		/**
		 * 联系人
		 */
		contact?: string;

		/**
		 * 手机号
		 */
		phone?: string;

		/**
		 * 省
		 */
		province?: string;

		/**
		 * 市
		 */
		city?: string;

		/**
		 * 区
		 */
		district?: string;

		/**
		 * 地址
		 */
		address?: string;

		/**
		 * 是否默认
		 */
		isDefault?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}


		interface BaseSysUserPageResponse {
		pagination: PagePagination;
		list: SysUserEntity[];
	}

	interface BaseSysRolePageResponse {
		pagination: PagePagination;
		list: SysRoleEntity[];
	}

	interface BaseSysMenuPageResponse {
		pagination: PagePagination;
		list: SysMenuEntity[];
	}

	interface BaseSysParamPageResponse {
		pagination: PagePagination;
		list: SysParamEntity[];
	}

	interface BaseSysLogPageResponse {
		pagination: PagePagination;
		list: SysLogEntity[];
	}

	interface DemoGoodsPageResponse {
		pagination: PagePagination;
		list: DemoGoodsEntity[];
	}

	interface TaskInfoPageResponse {
		pagination: PagePagination;
		list: TaskInfoEntity[];
	}

	interface DictInfoPageResponse {
		pagination: PagePagination;
		list: DictInfoEntity[];
	}

	interface DictTypePageResponse {
		pagination: PagePagination;
		list: DictTypeEntity[];
	}

	interface SpaceInfoPageResponse {
		pagination: PagePagination;
		list: SpaceInfoEntity[];
	}

	interface SpaceTypePageResponse {
		pagination: PagePagination;
		list: SpaceTypeEntity[];
	}

	interface RecycleDataPageResponse {
		pagination: PagePagination;
		list: any[];
	}

	interface PluginInfoPageResponse {
		pagination: PagePagination;
		list: PluginInfoEntity[];
	}

	interface UserInfoPageResponse {
		pagination: PagePagination;
		list: UserInfoEntity[];
	}

	interface UserAddressPageResponse {
		pagination: PagePagination;
		list: UserAddressEntity[];
	}


		interface BaseOpen {
		/**
		 * 验证码
		 */
		captcha(data?: any): Promise<any>;

		/**
		 * 实体信息与路径
		 */
		eps(data?: any): Promise<any>;

		/**
		 * 获得网页内容的参数值
		 */
		html(data?: any): Promise<any>;

		/**
		 * 登录
		 */
		login(data?: any): Promise<any>;

		/**
		 * 刷新token
		 */
		refreshToken(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: { captcha: string; eps: string; html: string; login: string; refreshToken: string; };

		/**
		 * 请求方法
		 */
		request: Request;
	}

	interface BaseSysUser {
		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 详情
		 */
		info(data?: any): Promise<SysUserEntity>;

		/**
		 * 列表
		 */
		list(data?: any): Promise<SysUserEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<BaseSysUserPageResponse>;

		/**
		 * 移动部门
		 */
		move(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: { add: string; delete: string; update: string; info: string; list: string; page: string; move: string; };

		/**
		 * 请求方法
		 */
		request: Request;
	}

	interface BaseSysRole {
		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 详情
		 */
		info(data?: any): Promise<SysRoleEntity>;

		/**
		 * 列表
		 */
		list(data?: any): Promise<SysRoleEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<BaseSysRolePageResponse>;

		/**
		 * 权限标识
		 */
		permission: { add: string; delete: string; update: string; info: string; list: string; page: string; };

		/**
		 * 请求方法
		 */
		request: Request;
	}

	interface BaseSysMenu {
		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 详情
		 */
		info(data?: any): Promise<SysMenuEntity>;

		/**
		 * 列表
		 */
		list(data?: any): Promise<SysMenuEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<BaseSysMenuPageResponse>;

		/**
		 * 创建代码
		 */
		create(data?: any): Promise<any>;

		/**
		 * 导出
		 */
		export(data?: any): Promise<any>;

		/**
		 * 导入
		 */
		import(data?: any): Promise<any>;

		/**
		 * 解析
		 */
		parse(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: { add: string; delete: string; update: string; info: string; list: string; page: string; create: string; export: string; import: string; parse: string; };

		/**
		 * 请求方法
		 */
		request: Request;
	}

	interface BaseSysDepartment {
		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 列表
		 */
		list(data?: any): Promise<SysDepartmentEntity[]>;

		/**
		 * 排序
		 */
		order(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: { add: string; delete: string; update: string; list: string; order: string; };

		/**
		 * 请求方法
		 */
		request: Request;
	}

	interface BaseSysParam {
		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 详情
		 */
		info(data?: any): Promise<SysParamEntity>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<BaseSysParamPageResponse>;

		/**
		 * 获得网页内容的参数值
		 */
		html(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: { add: string; delete: string; update: string; info: string; page: string; html: string; };

		/**
		 * 请求方法
		 */
		request: Request;
	}

	interface BaseSysLog {
		/**
		 * 分页查询
		 */
		page(data?: any): Promise<BaseSysLogPageResponse>;

		/**
		 * 清空日志
		 */
		clear(data?: any): Promise<any>;

		/**
		 * 获取日志保留天数
		 */
		getKeep(data?: any): Promise<any>;

		/**
		 * 设置日志保留天数
		 */
		setKeep(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: { page: string; clear: string; getKeep: string; setKeep: string; };

		/**
		 * 请求方法
		 */
		request: Request;
	}

	interface BaseComm {
		/**
		 * 实体信息与路径
		 */
		eps(data?: any): Promise<any>;

		/**
		 * 退出
		 */
		logout(data?: any): Promise<any>;

		/**
		 * 权限菜单
		 */
		permmenu(data?: any): Promise<any>;

		/**
		 * 当前登录人信息
		 */
		person(data?: any): Promise<any>;

		/**
		 * 修改个人信息
		 */
		personUpdate(data?: any): Promise<any>;

		/**
		 * 编程
		 */
		program(data?: any): Promise<any>;

		/**
		 * 上传文件
		 */
		upload(data?: any): Promise<any>;

		/**
		 * 上传模式
		 */
		uploadMode(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: { eps: string; logout: string; permmenu: string; person: string; personUpdate: string; program: string; upload: string; uploadMode: string; };

		/**
		 * 请求方法
		 */
		request: Request;
	}

	interface BaseCoding {
		/**
		 * 创建代码
		 */
		createCode(data?: any): Promise<any>;

		/**
		 * 获取模块目录结构
		 */
		getModuleTree(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: { createCode: string; getModuleTree: string; };

		/**
		 * 请求方法
		 */
		request: Request;
	}

	interface DemoGoods {
		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 详情
		 */
		info(data?: any): Promise<DemoGoodsEntity>;

		/**
		 * 列表
		 */
		list(data?: any): Promise<DemoGoodsEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<DemoGoodsPageResponse>;

		/**
		 * 权限标识
		 */
		permission: { add: string; delete: string; update: string; info: string; list: string; page: string; };

		/**
		 * 请求方法
		 */
		request: Request;
	}

	interface DemoTenant {
		/**
		 * 局部不使用多租户
		 */
		noTenant(data?: any): Promise<any>;

		/**
		 * 不使用多租户
		 */
		noUse(data?: any): Promise<any>;

		/**
		 * use
		 */
		use(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: { noTenant: string; noUse: string; use: string; };

		/**
		 * 请求方法
		 */
		request: Request;
	}

	interface TaskInfo {
		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 详情
		 */
		info(data?: any): Promise<TaskInfoEntity>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<TaskInfoPageResponse>;

		/**
		 * log
		 */
		log(data?: any): Promise<any>;

		/**
		 * once
		 */
		once(data?: any): Promise<any>;

		/**
		 * start
		 */
		start(data?: any): Promise<any>;

		/**
		 * stop
		 */
		stop(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: { add: string; delete: string; update: string; info: string; page: string; log: string; once: string; start: string; stop: string; };

		/**
		 * 请求方法
		 */
		request: Request;
	}

	interface DictInfo {
		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 详情
		 */
		info(data?: any): Promise<DictInfoEntity>;

		/**
		 * 列表
		 */
		list(data?: any): Promise<DictInfoEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<DictInfoPageResponse>;

		/**
		 * 获得字典数据
		 */
		data(data?: any): Promise<any>;

		/**
		 * 字典类型列表
		 */
		types(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: { add: string; delete: string; update: string; info: string; list: string; page: string; data: string; types: string; };

		/**
		 * 请求方法
		 */
		request: Request;
	}

	interface DictType {
		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 详情
		 */
		info(data?: any): Promise<DictTypeEntity>;

		/**
		 * 列表
		 */
		list(data?: any): Promise<DictTypeEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<DictTypePageResponse>;

		/**
		 * 权限标识
		 */
		permission: { add: string; delete: string; update: string; info: string; list: string; page: string; };

		/**
		 * 请求方法
		 */
		request: Request;
	}

	interface SpaceInfo {
		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 详情
		 */
		info(data?: any): Promise<SpaceInfoEntity>;

		/**
		 * 列表
		 */
		list(data?: any): Promise<SpaceInfoEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<SpaceInfoPageResponse>;

		/**
		 * 权限标识
		 */
		permission: { add: string; delete: string; update: string; info: string; list: string; page: string; };

		/**
		 * 请求方法
		 */
		request: Request;
	}

	interface SpaceType {
		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 详情
		 */
		info(data?: any): Promise<SpaceTypeEntity>;

		/**
		 * 列表
		 */
		list(data?: any): Promise<SpaceTypeEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<SpaceTypePageResponse>;

		/**
		 * 权限标识
		 */
		permission: { add: string; delete: string; update: string; info: string; list: string; page: string; };

		/**
		 * 请求方法
		 */
		request: Request;
	}

	interface RecycleData {
		/**
		 * info
		 */
		info(data?: any): Promise<any>;

		/**
		 * page
		 */
		page(data?: any): Promise<RecycleDataPageResponse>;

		/**
		 * 恢复数据
		 */
		restore(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: { info: string; page: string; restore: string; };

		/**
		 * 请求方法
		 */
		request: Request;
	}

	interface PluginInfo {
		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 详情
		 */
		info(data?: any): Promise<PluginInfoEntity>;

		/**
		 * 列表
		 */
		list(data?: any): Promise<PluginInfoEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<PluginInfoPageResponse>;

		/**
		 * 安装插件
		 */
		install(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: { add: string; delete: string; update: string; info: string; list: string; page: string; install: string; };

		/**
		 * 请求方法
		 */
		request: Request;
	}

	interface UserInfo {
		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 详情
		 */
		info(data?: any): Promise<UserInfoEntity>;

		/**
		 * 列表
		 */
		list(data?: any): Promise<UserInfoEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<UserInfoPageResponse>;

		/**
		 * 权限标识
		 */
		permission: { add: string; delete: string; update: string; info: string; list: string; page: string; };

		/**
		 * 请求方法
		 */
		request: Request;
	}

	interface UserAddress {
		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 详情
		 */
		info(data?: any): Promise<UserAddressEntity>;

		/**
		 * 列表
		 */
		list(data?: any): Promise<UserAddressEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<UserAddressPageResponse>;

		/**
		 * 权限标识
		 */
		permission: { add: string; delete: string; update: string; info: string; list: string; page: string; };

		/**
		 * 请求方法
		 */
		request: Request;
	}


	interface Service {
		request: Request;
	base: {
	open: BaseOpen;
	sys: {
	user: BaseSysUser;
	role: BaseSysRole;
	menu: BaseSysMenu;
	department: BaseSysDepartment;
	param: BaseSysParam;
	log: BaseSysLog;
	};
	comm: BaseComm;
	coding: BaseCoding;
	};
	demo: {
	goods: DemoGoods;
	tenant: DemoTenant;
	};
	task: {
	info: TaskInfo;
	};
	dict: {
	info: DictInfo;
	type: DictType;
	};
	space: {
	info: SpaceInfo;
	type: SpaceType;
	};
	recycle: {
	data: RecycleData;
	};
	plugin: {
	info: PluginInfo;
	};
	user: {
	info: UserInfo;
	address: UserAddress;
	};

	}
}

declare module "virtual:eps" {
	const eps: {
		service: any;
		list: any[];
		isUpdate: boolean;
	};

	export { eps };
}
