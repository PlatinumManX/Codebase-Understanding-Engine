from dataclasses import dataclass, field

@dataclass
class ResolvedCall:
    function: str
    file: str
    @classmethod
    def from_dict(cls, data):
        return cls(**data)
@dataclass
class FunctionInfo:
    name: str
    parameters: list[str] = field(default_factory=list)
    calls: list[str] = field(default_factory=list)
    # database_operations: list[str] = field(default_factory=list)
    resolved_calls: list[ResolvedCall] = field(default_factory=list)
    external_api_calls: list[str] = field(default_factory=list)
    source_code: str = ""
    is_async: bool = False
    @classmethod
    def from_dict(cls, data):
        return cls(
            name=data["name"],
            parameters=data.get("parameters", []),
            calls=data.get("calls", []),
            resolved_calls=[
                ResolvedCall.from_dict(call)
                for call in data.get("resolved_calls", [])
            ],
            external_api_calls=data.get("external_api_calls", []),
            source_code=data.get("source_code", ""),
            is_async=data.get("is_async", False)
        )


@dataclass
class ClassInfo:
    name: str
    methods: list[str] = field(default_factory=list)
    inherits: list[str] = field(default_factory=list)
    source_code: str = ""
    @classmethod
    def from_dict(cls, data):
        return cls(**data)


@dataclass
class RouteInfo:
    path: str
    handler: str
    methods: list[str] = field(default_factory=list)
    @classmethod
    def from_dict(cls, data):
        return cls(**data)

@dataclass
class ImportInfo:
    module: str
    symbols: list[str]
    alias: str | None
    is_internal: bool
    resolved_path: str | None
    @classmethod
    def from_dict(cls, data):
        return cls(**data)


@dataclass
class FileMetadata:
    file_name: str
    file_path: str

    imports: list[ImportInfo] = field(default_factory=list)

    module_calls: list[str] = field(default_factory=list)

    functions: list[FunctionInfo] = field(default_factory=list)

    classes: list[ClassInfo] = field(default_factory=list)

    routes: list[RouteInfo] = field(default_factory=list)
    
    dependencies: list[str] = field(default_factory=list)
    @classmethod
    def from_dict(cls, data):
        return cls(
            file_name=data["file_name"],
            file_path=data["file_path"],

            imports=[
                ImportInfo.from_dict(i)
                for i in data.get("imports", [])
            ],

            module_calls=data.get("module_calls", []),

            functions=[
                FunctionInfo.from_dict(f)
                for f in data.get("functions", [])
            ],

            classes=[
                ClassInfo.from_dict(c)
                for c in data.get("classes", [])
            ],
            routes=[
                RouteInfo.from_dict(r)
                for r in data.get("routes", [])
            ],

            dependencies=data.get("dependencies", [])
        )

@dataclass
class RepositoryMetadata:
    repository_name: str

    files: list[FileMetadata] = field(default_factory=list)
    @classmethod
    def from_dict(cls, data):
        return cls(
            repository_name=data["repository_name"],
            files=[
                FileMetadata.from_dict(f)
                for f in data.get("files", [])
            ]
        )