export class BaseObject {

    static _hashCode: number = 0;
    static _defaultMaxCount: number = 5000;
    static _maxCountMap: any = {};
 	static _poolsMap: any = {};

    static _returnObject(object: any) {
        var classType = String(object.constructor);
        var maxCount = BaseObject._maxCountMap[classType] == null
            ? BaseObject._defaultMaxCount
            : BaseObject._maxCountMap[classType];
        var pool = BaseObject._poolsMap[classType] = BaseObject._poolsMap[classType] || [];

        if (pool.length < maxCount) {
            if (pool.indexOf(object) < 0) {
                pool.push(object);
            } else {
                throw new Error();
            }
        }
    }

    /**
     * @version DragonBones 4.5
     */
    static setMaxCount(objectConstructor: any, maxCount: number) {
        if (maxCount < 0 || maxCount != maxCount) {
            maxCount = 0;
        }

        if (objectConstructor) {
            var classType = String(objectConstructor);
            BaseObject._maxCountMap[classType] = maxCount;
            var pool = BaseObject._poolsMap[classType];

            if (pool && pool.length > maxCount) {
                pool.length = maxCount;
            }
        } else {
            BaseObject._defaultMaxCount = maxCount;

            for (var classType in BaseObject._poolsMap) {
                if (BaseObject._maxCountMap[classType] == null) continue;

                BaseObject._maxCountMap[classType] = maxCount;
                var pool = BaseObject._poolsMap[classType];

                if (pool.length > maxCount) {
                    pool.length = maxCount;
                }
            }
        }
    }

    /**
     * @version DragonBones 4.5
     */
    static clearPool(objectConstructor: any = null) {
        if (objectConstructor) {
            var pool = BaseObject._poolsMap[String(objectConstructor)];
            
            if (pool && pool.length) {
                pool.length = 0;
            }
        } else {
            for (var iP in BaseObject._poolsMap) {
                var pool = BaseObject._poolsMap[iP];
                pool.length = 0;
            }
        }
    }

    /**
     * @version DragonBones 4.5
     */
    static borrowObject(objectConstructor: any): any {
        var pool = BaseObject._poolsMap[String(objectConstructor)];

        if (pool && pool.length) {
            return pool.pop();
        } else {
            var object = new objectConstructor();
            object._onClear();
            return object;
        }
    }

    hashCode: number;

	constructor() {
		/**
         * @version DragonBones 4.5
         */
        this.hashCode = BaseObject._hashCode++;
	}

    _onClear() {}

    /**
     * @version DragonBones 4.5
     */
    returnToPool() {
        this._onClear();
        BaseObject._returnObject(this);
    }

}
