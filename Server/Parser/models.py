from dataclasses import dataclass, field

@dataclass
class ResolvedCall:
    function: str
    file: str
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


@dataclass
class ClassInfo:
    name: str
    methods: list[str] = field(default_factory=list)
    inherits: list[str] = field(default_factory=list)
    source_code: str = ""


@dataclass
class RouteInfo:
    path: str
    handler: str
    methods: list[str] = field(default_factory=list)

@dataclass
class ImportInfo:
    module: str
    symbols: list[str]
    alias: str | None
    is_internal: bool
    resolved_path: str | None

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

@dataclass
class RepositoryMetadata:
    repository_name: str

    files: list[FileMetadata] = field(default_factory=list)